import { Router } from "express";
import {
  register,
  login,
  forgetPassword,
  resetPassword,
  changeUserPassword,
} from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { RegisterValidation } from "../validations/authValidation";

const router = Router();

router.post("/register", RegisterValidation, register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authenticateJWT, changeUserPassword);

export default router;
