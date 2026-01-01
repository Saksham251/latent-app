
import { Router } from "express";
import { prisma } from "@repo/db"; 
import { adminMiddleware } from "../../../middleware/admin";
import { CreateEventSchema,UpdateEventSchema } from "@repo/common";
import { getEvent } from "../../../controllers/event";

const router: Router = Router();

router.post("/", adminMiddleware, async (req, res) => {
    const {data, success} = CreateEventSchema.safeParse(req.body);
    const adminId = req.userId;

    if (!adminId) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    if (!success) {
        res.status(400).json({
            message: "Invalid data"
        })
        return
    }

    try {
        const event = await prisma.event.create({
            data: {
                name: data.name,
                description: data.description,
                startTime: data.startTime,
                locationId: data.location,
                banner: data.banner,
                adminId,
                seatTypes:{
                    create:data.seats.map((seat)=>({
                        name: seat.name,
                        description: seat.description,
                        price: seat.price,
                        capacity: seat.capacity
                    }))
                }
            }
        })
    
        res.json({
            id: event.id
        })
    } catch(e) {
        res.status(500).json({
            message: "Could not create event"
        })
    }
});

router.put("/metadata/:eventId", adminMiddleware, async (req, res) => {
    const {data, success} = UpdateEventSchema.safeParse(req.body);
    const adminId = req.userId;
    const eventId = req.params.eventId ?? "";

    if (!adminId) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    if (!success) {
        res.status(400).json({
            message: "Invalid data"
        })
        return
    }

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })

        if (!event || event.adminId !== adminId) {
            res.status(404).json({
                message: "Cant update event"
            })
            return
        }

        await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                name: data.name,
                description: data.description,
                startTime: data.startTime,
                locationId: data.location,
                banner: data.banner,
                adminId,
                published: data.published,
                ended: data.ended
            }
        })
    
        res.json({
            id: event.id
        })
    } catch(e) {
        res.status(500).json({
            message: "Could not update event"
        })
    }

});

router.get("/", adminMiddleware, async (req, res) => {
    const events = await prisma.event.findMany({
        where: {
            adminId: req.userId
        }
    });

    res.json({
        events
    })
});

router.get("/:eventId", adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const event = await getEvent(req.params.eventId ?? "", adminId);

    if (!event) {
        res.status(404).json({
            message: "Event not found"
        })
        return
    }

    res.json({
        event
    });
});

export default router;