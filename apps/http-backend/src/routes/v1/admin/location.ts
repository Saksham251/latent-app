import { Router } from "express";
import { prisma } from "@repo/db"; 
import { adminMiddleware } from "../../../middleware/admin";
import { CreateLocationSchema} from "@repo/common";
import { superAdminMiddleware } from "../../../middleware/superadmin";

const router: Router = Router();

router.post("/", superAdminMiddleware, async (req, res) => {
    const {data, success} = CreateLocationSchema.safeParse(req.body);

    if (!success) {
        res.status(400).json({
            message: "Invalid data"
        })
        return
    }

    try {
        const location = await prisma.location.create({
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
            }
        })
    
        res.json({
            id: location.id
        })
    } catch(e) {
        res.status(500).json({
            message: "Could not create location"
        })
    }

});

router.get("/locations", adminMiddleware, async (req, res) => {
    const locations = await prisma.location.findMany();

    res.json({
        locations
    })
});

export default router;