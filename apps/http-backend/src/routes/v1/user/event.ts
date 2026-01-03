import { prisma } from "@repo/db";
import { Router } from "express";


const router:Router = Router();

router.get("/",async(req,res)=>{
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