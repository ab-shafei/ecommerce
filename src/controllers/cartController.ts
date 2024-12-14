import { NextFunction, Response } from "express";

import {
  addToCart,
  clearCartItems,
  fetchUserCart,
  removeFromCart,
  updateQuantity,
} from "../services/cartService";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { AppError } from "../middlewares/AppError";

export const getUserCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const cart = await fetchUserCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { productId, size, color, quantity } = req.body;

    if (!productId || !size || !color) {
      throw new AppError(400, "Missing required fields");
    }

    const cart = await addToCart(userId, {
      productId,
      size,
      color,
      quantity,
    });
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateProductQuantity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user!.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await updateQuantity(customerId, {
      productId,
      quantity,
    });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const deleteProductFromCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user!.id;
    const { productId } = req.params;

    await removeFromCart(customerId, { productId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user!.id;

    await clearCartItems(customerId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
