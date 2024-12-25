import { Request, Response, NextFunction, query } from "express";
import { parse } from "valibot";
import { AppError } from "../middlewares/AppError";
import {
  CreateProductRequestSchema,
  DeleteProductRequestSchema,
  GetProductsRequestSchema,
  UpdateProductRequestSchema,
} from "./schemas/productSchema";

export async function getProductsValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(GetProductsRequestSchema, { query: req.query });
    req.query = validatedData.query;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}

export async function createProductValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(CreateProductRequestSchema, { body: req.body });
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}

export async function updateProductValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(UpdateProductRequestSchema, {
      params: req.params,
      body: req.body,
    });
    req.params = validatedData.params;
    req.body = validatedData.body;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}

export async function deleteProductValidation(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const validatedData = parse(DeleteProductRequestSchema, {
      params: req.params,
    });
    req.params = validatedData.params;
    next();
  } catch (error: any) {
    next(new AppError(400, `Validation Error: ${error.message}`));
  }
}
