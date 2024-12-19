import { NextFunction, Request, Response } from "express";
import {
  addProduct,
  fetchAllProducts,
  fetchProductById,
  modifyProduct,
  removeProduct,
  uploadImages,
} from "../services/productService";
import { AppError } from "../middlewares/AppError";
import { Decimal } from "@prisma/client/runtime/library";

const allowedUploadTypes = ["images", "dimensionsImages"];

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await fetchAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await fetchProductById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      color,
      size,
      price,
      inStock,
      categoryId,
      priceAfterDiscount,
    } = req.body;

    if (!name || !color || !size || !price || !categoryId) {
      throw new AppError(400, "Missing required fields");
    }

    if (isNaN(price)) {
      throw new AppError(400, "Price must be a valid number");
    }

    if (priceAfterDiscount && isNaN(priceAfterDiscount)) {
      throw new AppError(400, "priceAfterDiscount  must be a valid number");
    }

    const product = await addProduct({
      name,
      color,
      size,
      price,
      categoryId,
      inStock,
      priceAfterDiscount,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const uploadProductImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { uploadType } = req.query;
  const { files } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (typeof uploadType !== "string") {
    throw new AppError(400, "Upload type must be a string");
  }
  const isAllowedUploadType = allowedUploadTypes.includes(uploadType);
  if (!isAllowedUploadType) throw new AppError(400, "Upload type not allowed");

  try {
    await uploadImages({ id, uploadType, files });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      color,
      size,
      price,
      priceAfterDiscount,
      inStock,
      categoryId,
    } = req.body;

    if (price && isNaN(price)) {
      throw new AppError(400, "Price must be a valid number");
    }

    if (priceAfterDiscount && isNaN(priceAfterDiscount)) {
      throw new AppError(400, "Price must be a valid number");
    }

    const product = await modifyProduct(id, {
      name,
      color,
      size,
      price,
      priceAfterDiscount,
      inStock,
      categoryId,
    });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await removeProduct(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
