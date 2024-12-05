import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    throw new AppError(401, "Access denied");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid token");
  }
};
