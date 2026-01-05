import { Router } from "express";
import { userMiddleware } from "../../../middleware/user";
import { prisma } from "@repo/db";
import { CreateBookingSchema } from "@repo/common";
import {getRedisKey,incrCount} from "@repo/redis";
const router:Router = Router();

router.get("/",userMiddleware,async(req,res)=>{
    const bookings = await prisma.booking.findMany({
        where:{
            userId:req.userId
        }
    });
    return res.status(200).json({
        bookings
    });
});

router.post("/",userMiddleware,async (req,res)=>{
    const {data,success} = CreateBookingSchema.safeParse(req.body);
    if(!success){
        res.status(400).json({
            "message":"Invalid data"
        });
        return;
    }
    const userId = req.userId;
    if(!userId){
        res.status(401).json({
            "message":"Unauthorized"
        });
        return;
    }
    const event = await prisma.event.findUnique({
        where:{
            id:data.eventId
        }
    });
    if(!event){
        res.status(404).json({
            message: "Event not found "
        })
        return
    }
    const eventStartTime = new Date(event.startTime);
    if(eventStartTime > new Date()){
        res.status(404).json({
            message: "Event already started"
        })
        return
    }
    try{
        const counter = await incrCount(getRedisKey(`bookings-${data.eventId}`));
        const booking = await prisma.booking.create({
            data: {
                eventId: data.eventId,
                userId: userId,
                status: "Pending",
                sequenceNumber: counter,
                currentSequenceNumber: counter,
                seats: {
                    create: data.seats.map(seat => ({
                        seatTypeId: seat.id,
                        qr: ""
                    }))
                },
                expiry: new Date(new Date().getTime() + event.timeoutInS * 1000)
            }
        });
        res.json({
            id:booking.id
        }); 
    }
    catch(error){
        res.status(500).json({
            message: "Could not create booking"
        })
    }
});
export default router;