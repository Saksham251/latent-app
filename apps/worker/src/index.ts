import {prisma} from "@repo/db";

async function  main() {
    const pendingEvents = await prisma.event.findMany({
        where:{
            published:true,
            ended:false,
            startTime:{
                gt:new Date()
            }
        }
    });
    for(const event of pendingEvents){
        await flushEvents(event);
    }
}

async function flushEvents(event:{id:string,processed:number}) {
    await clearUnpaidBookings(event.id);
    await allowNewBookings(event);
}

async function clearUnpaidBookings(eventId:string) {
    const unpaidBookings = await prisma.booking.findMany({
        where:{
            eventId,
            status: "PendingPayment",
            expiry:{
                lt:new Date()
            }
        },
        include: {
            seats: true
        }
    });
    if(unpaidBookings.length===0){
        return;
    }
    const seatsMap = getUpdatedLockedSeats(unpaidBookings);
    await prisma.$transaction([
        prisma.booking.updateMany({
            where:{
                id:{
                    "in":unpaidBookings.map(x=>x.id)
                },
                status:"PendingPayment"
            },
            data:{
                status: "Timeout"
            }
        }),
        ...seatsMap.map(([seatId, count]) => prisma.seatType.updateMany({
            where:{
                id:seatId
            },
            data:{
                locked:{
                    "decrement":count
                }
            }
        }))
    ]);
}

function getUpdatedLockedSeats(
    unpaidBookings:{
        id:string;
        seats:{
            id:string;
            seatTypeId:string
        }[]
    }[]
){
    const seatsMap = new Map<string,number>();
    unpaidBookings.forEach(element=>{
        element.seats.forEach(seat=>{seatsMap.set(seat.seatTypeId,(seatsMap.get(seat.seatTypeId) ?? 0)+1);

        })
    })
    return Array.from(seatsMap.entries());
}

async function allowNewBookings(event:{id:string,processed:number}) {
    // Steps to perform 
    // 1. fetch pendingBookings (FIFO)
    // 2. calculate seat availability snapshots
    // 3. for each bookings:
        // allowed? -> move to PendingPayment
        // impossible? -> mark filled
    // 4. Commit all updates in one transaction

    const eventId = event.id;
    const pendingBookings = await prisma.booking.findMany({
        where:{
            eventId,
            status:"Pending"
        },
        take:100,
        orderBy:{
            sequenceNumber:"asc"
        },
        include:{
            seats:true
        }
    });
    if (pendingBookings.length === 0) {
        return;
    }
    const seatsMap = await seatAvailabilityMap(eventId);
    let allowedUpdatedBookings:any = [];
    let bookingsToMarkAsFilled:any = [];

    for (const booking of pendingBookings) {
        let isAllowed = true;
        const userMap = new Map<string,number>();

        for(const seat of booking.seats){
            userMap.set(seat.seatTypeId,(userMap.get(seat.seatTypeId) ?? 0)+1);
        }
        for (const [seatId,count] of userMap.entries()){
            if((seatsMap.get(seatId)?.currentlyAvailable??0)<count){
                isAllowed=false;
                break;
            }
        }

        if(!isAllowed){
            let shouldRemoveFromDb = false;
            for (const [seatId, count] of userMap.entries()) {
                if ((seatsMap.get(seatId)?.available ?? 0) < count) {
                    shouldRemoveFromDb = true;
                    break;
                }
            }
            if(shouldRemoveFromDb){
                bookingsToMarkAsFilled.push(booking);
            }
            continue;
        }
        allowedUpdatedBookings.push(booking);
    }
    if(allowedUpdatedBookings.length===0 && bookingsToMarkAsFilled.length===0){
        return;
    }

    await prisma.$transaction([
        prisma.booking.updateMany({
            where:{
                id:{
                    "in":allowedUpdatedBookings.map((x:any)=>x.id)
                }
            },
            data:{
                status:"PendingPayment"
            }
        }),
        prisma.booking.updateMany({
            where:{
                id:{
                    "in":bookingsToMarkAsFilled.map((x:any)=>x.id)
                }
            },
            data:{
                status:"Filled"
            }
        }),
        
        prisma.event.update({
            where:{
                id:event.id
            },
            data:{
                processed:Math.max(...allowedUpdatedBookings.map((x:any)=>x.sequenceNumber),event.processed)
            }
        })
    ]);
}

async function seatAvailabilityMap(eventId:string) {
    const seatsMap = new Map<string,{available:number,currentlyAvailable:number}>();
    const event = await prisma.event.findUnique({
        where:{
            id:eventId
        },
        include: {
            seatTypes: true
        }
    });
    event?.seatTypes.forEach(x=>{
        seatsMap.set(x.id,{available:x.capacity-x.filled,currentlyAvailable:x.capacity-x.filled-x.locked});
    });
    return seatsMap;
}
main();