import { NextFunction, Request, Response } from "express";
import {
  addProduct,
  fetchAllProducts,
  fetchProductById,
  modifyProduct,
  modifyProductStock,
  removeProduct,
  uploadImages,
} from "../services/productService";
import { AppError } from "../middlewares/AppError";

const allowedUploadTypes = ["images", "dimensionsImages"];

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await fetchAllProducts(req.query);
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
    const product = await addProduct(req.body);
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
    const product = await modifyProduct(req.params.id, req.body);
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

export const updateProductStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, inStock } = req.body;

  try {
    const product = await modifyProductStock(productId, inStock);
    res.status(200).json({ message: "Stock updated successfully!", product });
  } catch (error) {
    next(error);
  }
};
