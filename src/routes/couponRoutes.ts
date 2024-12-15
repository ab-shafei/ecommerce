import { Router } from "express";
import {
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
} from "../controllers/couponController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAllCoupons);
router.get("/:id", getCouponById);
router.post("/", authenticateJWT, authorizeRoles("ADMIN"), createCoupon);
router.put("/:id", authenticateJWT, authorizeRoles("ADMIN"), updateCoupon);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteCoupon);

export default router;
