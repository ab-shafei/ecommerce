import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  forgetUserPassword,
  resetUserPassword,
} from "../services/authService";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, phoneNumber } = req.body;
  try {
    const user = await registerUser(email, password, name, phoneNumber);
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
    const message = await resetUserPassword(token, password);
    res.json(message);
  } catch (error) {
    next(error);
  }
};
