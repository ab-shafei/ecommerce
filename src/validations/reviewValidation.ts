import { Request, Response, NextFunction, query } from "express";
import { parse } from "valibot";
import { AppError } from "../middlewares/AppError";
import {
  AddReviewRequestSchema,
  UpdateReviewRequestSchema,
} from "./schemas/reviewSchema";

export async function addReviewValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(AddReviewRequestSchema, { body: req.body });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}

export async function updateReviewValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(UpdateReviewRequestSchema, {
      body: req.body,
    });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}
