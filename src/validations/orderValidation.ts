import { Request, Response, NextFunction } from "express";
import { parse } from "valibot";
import { AppError } from "../middlewares/AppError";
import {
  CreateOrderRequestSchema,
  UpdateOrderRequestSchema,
} from "./schemas/orderSchema";

export async function createOrderValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(CreateOrderRequestSchema, { body: req.body });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}

export async function updateOrderValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(UpdateOrderRequestSchema, {
      body: req.body,
    });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}
