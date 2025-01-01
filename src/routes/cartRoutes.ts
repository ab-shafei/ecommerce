import { Router } from "express";
import {
  addProductToCart,
  applyCouponToUserCart,
  clearCart,
  deleteProductFromCart,
  getUserCart,
  updateProductQuantity,
} from "../controllers/cartController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("CUSTOMER"), getUserCart);
router.post("/", authenticateJWT, authorizeRoles("CUSTOMER"), addProductToCart);
// router.put(
//   "/applyCoupon",
//   authenticateJWT,
//   authorizeRoles("CUSTOMER"),
//   applyCouponToUserCart
// );
router.put(
  "/:cartItemId",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  updateProductQuantity
);
router.delete(
  "/:cartItemId",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  deleteProductFromCart
);
router.delete("/", authenticateJWT, authorizeRoles("CUSTOMER"), clearCart);

export default router;
