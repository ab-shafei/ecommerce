import { Router } from "express";
import { subscribeForNotification } from "../controllers/notificationController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { productSubscribeValidation } from "../validations/subscribeValidation";

const router = Router();

router.post(
  "/subscribe",
  productSubscribeValidation,
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  subscribeForNotification
);

export default router;
