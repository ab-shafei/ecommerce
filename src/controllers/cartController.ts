import { NextFunction, Response } from "express";

import { fetchUserCart } from "../services/cartService";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

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

// export const addToUserCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { customerId } = req.query as { [key: string]: string };

//     const { name } = req.body;
//     const { images } = req.files as {
//       [fieldname: string]: Express.Multer.File[];
//     };

//     const cart = await addToCart({
//       name,
//     });
//     res.status(201).json(cart);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { customerId } = req.query as { [key: string]: string };

//     const { name } = req.body;
//     const { images } = req.files as {
//       [fieldname: string]: Express.Multer.File[];
//     };

//     const cart = await modifyCart(
//       {
//         name,
//       },
//       images
//     );
//     res.status(200).json(cart);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteFromCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     await removeFromCart(id);
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// };
