import { Router } from "express";
import {
  register,
  login,
  forgetPassword,
  resetPassword,
  changeUserPassword,
} from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authenticateJWT, changeUserPassword);

export default router;
