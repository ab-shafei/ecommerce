import { Request, Response, NextFunction } from "express";
import { parse } from "valibot";
import { AppError } from "../middlewares/AppError";
import { RegisterRequestSchema } from "./schemas/authSchema";

export async function RegisterValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(RegisterRequestSchema, {
      body: req.body,
    });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}
