import { Request, Response, NextFunction } from "express";
import { parse } from "valibot";
import { AppError } from "../middlewares/AppError";
import { ChangeLayoutRequestSchema } from "./schemas/layoutSchema";

export async function changeLayoutValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(ChangeLayoutRequestSchema, {
      body: req.body,
    });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}
