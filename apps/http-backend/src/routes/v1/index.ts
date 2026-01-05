import { Router, type Router as ExpressRouter } from "express";
import userRouter from "./user";
import adminEventRouter from "./admin/event";
import adminRouter from "./admin/index";
import adminLocationRouter from "./admin/location";
import bookingsRouter from "./user/bookings";
import transactionRouter from "./user/transaction";
import superAdminRouter from "./superadmin/index"
import testRouter from "./test/index";

const router:ExpressRouter = Router();


router.use("/user/transaction",transactionRouter);
router.use("/user/bookings",bookingsRouter);
router.use("/user",userRouter);
router.use("/razorpay", razorpayRouter);
router.use("/admin/event",adminEventRouter);
router.use("/admin/location",adminLocationRouter);
router.use("/admin", adminRouter);
router.use("/superadmin", superAdminRouter);

if (process.env.NODE_ENV !== "production") {
    // Used only for testing, should never be deployed to prod.
    // Lets the tester create admins etc
    router.use("/test", testRouter);
}
export default router;