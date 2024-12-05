import { NextFunction, Request, Response } from "express";
import {
  addProduct,
  fetchAllProducts,
  fetchProductById,
  modifyProduct,
  removeProduct,
} from "../services/productService";

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
    const { name, images, color, size, price, categoryId } = req.body;
    const product = await addProduct({
      name,
      images,
      color,
      size,
      price,
      categoryId,
    });
    res.status(201).json(product);
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
    const { name, images, color, size, price } = req.body;
    const product = await modifyProduct(id, {
      name,
      images,
      color,
      size,
      price,
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
