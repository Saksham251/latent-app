import { Router } from "express";
import { prisma } from "@repo/db";
import { superAdminMiddleware } from "../../../middleware/superadmin";
import { UpdateEventSchema } from "@repo/common";

const router: Router = Router();

router.get("/", superAdminMiddleware, async (req, res) => {
    const events = await prisma.event.findMany();

    res.json({
        events
    })
});

router.put("/metadata/:eventId", superAdminMiddleware, async (req, res) => {
    const {data, success} = UpdateEventSchema.safeParse(req.body);
    const eventId = req.params.eventId ?? "";

    if (!success) {
        res.status(400).json({
            message: "Invalid data"
        })
        return
    }

    try {
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
                published: data.published,
                ended: data.ended
            }
        })
    
        res.json({
            message: "Updated event"
        })
    } catch(e) {
        res.status(500).json({
            message: "Could not update event"
        })
    }

});

export default router;