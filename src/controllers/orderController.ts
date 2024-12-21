import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  // updateOrder,
  // deleteOrder,
} from "../services/orderServices";

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
    const convertedOrderId = parseInt(req.params.orderId, 10);

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

// export const updateUserOrder = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id: userId } = req.user!;
//   const { orderId } = req.params;
//   const { name, phoneNumber, city, region, orderLine1, orderLine2, isDefault } =
//     req.body;

//   try {
//     const convertedOrderId = parseInt(orderId, 10);
//     if (isNaN(convertedOrderId)) {
//       throw new AppError(400, "Invalid order ID");
//     }

//     if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
//       throw new AppError(
//         400,
//         'Invalid phone number format. It should start with "+" and include 10-15 digits'
//       );
//     }
//     const order = await updateOrder(userId, convertedOrderId, {
//       name,
//       phoneNumber,
//       city,
//       region,
//       orderLine1,
//       orderLine2,
//       isDefault,
//     });
//     res.status(201).json(order);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteUserOrder = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id: userId } = req.user!;
//   const { orderId } = req.params;

//   try {
//     const convertedOrderId = parseInt(orderId, 10);
//     if (isNaN(convertedOrderId)) {
//       throw new AppError(400, "Invalid order ID");
//     }
//     const order = await deleteOrder(userId, convertedOrderId);
//     res.status(200).json(order);
//   } catch (error) {
//     next(error);
//   }
// };
