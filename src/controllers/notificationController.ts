import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { subscribe } from "../services/notificationService";

export const subscribeForNotification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user!;
  const { productId } = req.body;

  try {
    // Check if the user is already subscribed
    const notification = await subscribe(userId, productId);

    res.status(201).json({
      message: "You will be notified when the product is back in stock.",
      notification,
    });
  } catch (error) {
    next(error);
  }
};
