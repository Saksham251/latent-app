import { Router, type Router as ExpressRouter } from "express";
import userRouter from "./user";
const router:ExpressRouter = Router();

router.use("/user",userRouter);

export default router;