import { Router } from "express";
import { paymentPostPay } from "../controllers/paymentController";
const router = Router();

router.post("/post_pay", paymentPostPay);

export default router;
