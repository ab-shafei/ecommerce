import { Request, Response, NextFunction } from "express";
import { processPaymentPostPay } from "../services/paymentService";

export const paymentPostPay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { success, order: orderId } = req.body;

  try {
    await processPaymentPostPay(success, orderId);

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    next(error);
  }
};
