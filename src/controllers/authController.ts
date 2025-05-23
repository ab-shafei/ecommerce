import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  forgetUserPassword,
  resetUserPassword,
  changePassword,
} from "../services/authService";
import { validatePassword } from "../utils/validate";
import { AppError } from "../middlewares/AppError";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const message = await forgetUserPassword(email);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!validatePassword(password)) {
      throw new AppError(
        400,
        "Password must be at least 8 characters long and include at least one letter and one number"
      );
    }
    const message = await resetUserPassword(token, password);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user!;
  const { oldPassword, newPassword } = req.body;
  try {
    if (!validatePassword(newPassword)) {
      throw new AppError(
        400,
        "Password must be at least 8 characters long and include at least one letter and one number"
      );
    }
    const user = await changePassword(id, {
      oldPassword,
      newPassword,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
