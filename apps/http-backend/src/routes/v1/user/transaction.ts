import { prisma } from "@repo/db";
import { Router } from "express";
import { userMiddleware } from "../../../middleware/user";

const router:Router = Router();


router.get("/",userMiddleware,async (req,res)=>{
    const transactions = await prisma.payment.findMany({
        where:{
            userId:req.userId
        }
    });
    res.json({
        transactions
    });
});

export default router;