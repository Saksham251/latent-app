import { prisma } from "@repo/db";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router:Router = Router();

router.get("/events",async(req,res)=>{
    const events = await prisma.event.findMany({
        where:{
            published:true,
            ended:false
        }
    });
    res.json({
        events
    });
});

export default router;