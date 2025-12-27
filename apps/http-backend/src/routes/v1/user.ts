import { Router, type Router as ExpressRouter } from "express";
import {generateToken, verifyToken} from "authenticator";

const router:ExpressRouter = Router();



router.use("/signup",async (req,res)=>{
    const phoneNumber = req.body.phoneNumber;
    let tOtp = generateToken(phoneNumber+"SIGNUP");
    res.status(200).send({message:"Signup route",
        tOtp
     });
});


router.use("/signup/verify",async (req,res)=>{
    const phoneNumber = req.body.phoneNumber;
    if(!verifyToken(phoneNumber+"SIGNUP",req.body.otp)){
        res.status(403).json({
            "message":"Invalid Token"
        });
        return;
    }
    // create entry for user in db 
    res.status(200).json({
        
    });
    return;
});


export default router;