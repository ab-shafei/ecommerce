import { Router } from "express";
import {
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  getLoggedUserCoupons,
} from "../controllers/couponController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAllCoupons);
router.get(
  "/me",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  getLoggedUserCoupons
);
router.get("/:id", getCouponById);
router.post("/", authenticateJWT, authorizeRoles("ADMIN"), createCoupon);
router.put("/:id", authenticateJWT, authorizeRoles("ADMIN"), updateCoupon);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteCoupon);

export default router;
