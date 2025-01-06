import { Request, Response, NextFunction } from "express";
import { parse } from "valibot";
import { AppError } from "../middlewares/AppError";
import {
  AddAddressRequestSchema,
  UpdateAddressRequestSchema,
} from "./schemas/addressSchema";

export async function addAddressValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(AddAddressRequestSchema, {
      body: req.body,
    });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}

export async function updateAddressValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(UpdateAddressRequestSchema, {
      body: req.body,
    });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}
