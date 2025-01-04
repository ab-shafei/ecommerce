import { Request, Response, NextFunction } from "express";
import { processPaymentPostPay } from "../services/paymentService";

export const paymentPostPay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { success, order } = req.body.obj;

  try {
    await processPaymentPostPay(success, order.id);

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    next(error);
  }
};
