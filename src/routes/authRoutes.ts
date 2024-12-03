import { Router } from "express";
import {
  register,
  login,
  forgetPassword,
  resetPassword,
  // verifyPhoneNumber,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
