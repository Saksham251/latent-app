import { Router, type Router as ExpressRouter } from "express";
import userRouter from "./user/user";
import adminEventRouter from "./admin/event";
import adminRouter from "./admin/index";
import adminLocationRouter from "./admin/location";
import testRouter from "./test/index";

const router:ExpressRouter = Router();


router.use("/user",userRouter);
router.use("/admin/event",adminEventRouter);
router.use("/admin/location",adminLocationRouter);
router.use("/admin", adminRouter);

if (process.env.NODE_ENV !== "production") {
    // Used only for testing, should never be deployed to prod.
    // Lets the tester create admins etc
    router.use("/test", testRouter);
}
export default router;