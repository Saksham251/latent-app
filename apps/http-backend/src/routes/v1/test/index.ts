import { Router } from "express";
import { createAdmin } from "../../../controllers/test";
import { AdminType, prisma } from "@repo/db";
import  jwt  from "jsonwebtoken";
import { JWT_PASSWORD } from "../../../config";
const router:Router = Router();

router.post("/create-user",async (req,res)=>{
    const number = req.body.number;
    const name = req.body.name;
    const user = await prisma.user.create({
        data:{
            name,
            number
        }
    });
    const token = jwt.sign({
        userId:user.id
    },JWT_PASSWORD);
    res.status(200).json({
        token
    })
});
router.post("/create-admin",async (req,res)=>{
    const number = req.body.number;
    const name = req.body.name;
    const token = await createAdmin(number,name,AdminType.Creator);
    res.status(200).json({
        token
    })
});

router.post("/create-super-admin",async (req,res)=>{
    const number = req.body.number;
    const name = req.body.name;
    const token = await createAdmin(number,name,AdminType.SuperAdmin);
    res.status(200).json({
        token
    })
});
export default router;