import { Router } from "express";
import { createAdmin } from "../../../controllers/test";
import { AdminType } from "@repo/db";
const router:Router = Router();

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