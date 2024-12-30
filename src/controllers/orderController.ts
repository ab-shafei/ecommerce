import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderServices";
import { AppError } from "../middlewares/AppError";

export const getAllOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getOrders();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getLoggedUserOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getUserOrders(req.user!.id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const convertedOrderId = parseInt(req.params.id, 10);

    if (isNaN(convertedOrderId)) {
      throw new AppError(400, "Invalid order ID");
    }

    const order = await getOrder(convertedOrderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const createUserOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderDetails = await createOrder(req.user!.id, {
      ...req.body,
    });
    res.status(201).json(orderDetails);
  } catch (error) {
    next(error);
  }
};

export const updateUserOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: orderId } = req.params;

  try {
    const convertedOrderId = parseInt(orderId, 10);
    if (isNaN(convertedOrderId)) {
      throw new AppError(400, "Invalid order ID");
    }
    const order = await updateOrder(convertedOrderId, req.body);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteUserOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  try {
    const convertedOrderId = parseInt(orderId, 10);
    if (isNaN(convertedOrderId)) {
      throw new AppError(400, "Invalid order ID");
    }
    const order = await deleteOrder(convertedOrderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
