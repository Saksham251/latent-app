import {Router} from "express";
import {prisma} from "@repo/db";
import { RazorpayWebhookSchema } from "@repo/common";


const router:Router = Router();


router.post("/payment",async (req,res)=>{
    const {data,success} = RazorpayWebhookSchema.safeParse(req.body);
    if(!success){
        res.status(400).json({
            "mesaage":"Invalid data"
        });
        return;
    }
    if(data.webhookSecret!==process.env.RAZORPAY_WEBHOOK_SECRET){
        res.status(401).json({
            "mesaage":"Invalid secret"
        });
        return;
    }
    try{
        await prisma.booking.update({
            where:{
                id:data.notes.bookingId
            }, 
            data: {
                paymentId: data.id,
                status: "Confirmed"
            }

        });
        res.status(200).json({
            "message":"Created Payment Successfully"
        });
    }
    catch(error){
        res.status(500).json({
           "mesaage":"Could not create payment" 
        });
        return;
    }
});