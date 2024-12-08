import { Router } from "express";
import { updateUser, deleteUser } from "../controllers/userController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("ADMIN", "CUSTOMER"),
  updateUser
);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteUser);

export default router;
