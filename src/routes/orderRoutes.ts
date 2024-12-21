import { Router } from "express";
import {
  getAllOrders,
  getLoggedUserOrders,
  getOrderById,
  createUserOrder,
  // updateUserOrder,
  // deleteUserOrder,
} from "../controllers/orderController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { createOrderValidation } from "../validations/orderValidation";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("ADMIN"), getAllOrders);

router.get(
  "/me",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  getLoggedUserOrders
);

router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("CUSTOMER", "ADMIN"),
  getOrderById
);

router.post(
  "/",
  createOrderValidation,
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  createUserOrder
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("CUSTOMER", "ADMIN")
  // updateUserOrder
);

// router.delete(
//   "/:id",
//   authenticateJWT,
//   authorizeRoles("CUSTOMER", "ADMIN"),
//   deleteUserOrder
// );

export default router;
