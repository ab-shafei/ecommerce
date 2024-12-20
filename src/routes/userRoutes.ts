import { Router } from "express";
import {
  getAllCustomers,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
} from "../controllers/userController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { createUserValidation } from "../validations/userValidation";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("ADMIN"), getAllUsers);

router.get(
  "/customers",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  getAllCustomers
);

router.post(
  "/",
  createUserValidation,
  authenticateJWT,
  authorizeRoles("ADMIN"),
  createUser
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("ADMIN", "CUSTOMER"),
  updateUser
);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteUser);

export default router;
