import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./AppError";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
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
    const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
    req.user = decoded.user;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid token");
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden: Access denied");
    }

    next();
  };
};
