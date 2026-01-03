import { Router } from "express";
import { userMiddleware } from "../../../middleware/user";
import { prisma } from "@repo/db";

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

export default router;