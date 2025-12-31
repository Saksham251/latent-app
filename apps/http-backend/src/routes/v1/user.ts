import { Router, type Router as ExpressRouter } from "express";
import {verifyToken,getToken} from "../../utils/totp";
import {prisma} from "@repo/db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { sendMessage } from "../../utils/twilio";

const router:ExpressRouter = Router();



router.post("/signup",async (req,res)=>{
    const number = req.body.number;
    const totp = getToken(number, "AUTH");

    const user = await prisma.user.upsert({
        where:{
            number
        },
        create:{
            number,
            name:""
        },
        update:{}
    });

    if(process.env.NODE_ENV==="production"){
        try{
            // send OTP to user
            await sendMessage(`Your OTP for logging into latent is ${totp}`,number);
        }
        catch(error){
            res.status(500).json({
                "message":"Could not send OTP"
            });
            return;
        }
    }
    res.status(200).send({message:"Signup route",
        userId:user.id
     });
});


router.post("/signup/verify",async (req,res)=>{
    const number = req.body.phoneNumber;
    const name = req.body.name;
    const otp = req.body.otp;
    if(process.env.NODE_ENV==="production" && !verifyToken(number,"AUTH",otp)){
        res.status(403).json({
            "message":"Invalid Token"
        });
        return;
    }
    // create entry for user in db 

    const user = await prisma.user.update({
        where:{
            number
        },
        data:{
            name,
            verifed:true
        }
    });
    const token = jwt.sign({userId:user.id},JWT_PASSWORD);
    res.status(200).json({
        token
    });
    return;
});


router.post("/signin",async (req,res)=>{
    const number = req.body.number;
    let totp = getToken(number,"AUTH");
    
    try{
        console.log(number);
        const user = await prisma.user.findFirstOrThrow({
            where:{
                number
            }
        });
        console.log("After Number" + number);
        console.log("env is " + process.env.NODE_ENV);
        if (process.env.NODE_ENV === "production") {
            console.log("inside send message")
            // send otp to user
            try {
                await sendMessage(`Your otp for logging into latent is ${totp}`, number)
            } catch(e) {
                res.status(500).json({
                    message: "Could not send otp"
                })
                return   
            }
        }
    }
    catch(error){
        res.status(411).json({
            message: "User invalid"
        });
    }
});


router.post("/signin/verify",async (req,res)=>{
    const number = req.body.number;
    if(process.env.NODE_ENV === "production" && !verifyToken(number,"AUTH",req.body.otp)){
        res.status(403).json({
            "message":"Invalid Token"
        });
        return;
    }
    // create entry for user in db 

    const user = await prisma.user.findFirstOrThrow({
        where: {
            number
        }
    });

    const token = jwt.sign({userId:user.id},JWT_PASSWORD);
    res.status(200).json({
        token
    });
    return;
});

export default router;