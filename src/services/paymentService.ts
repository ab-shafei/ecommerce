import { Address, OrderItem, PaymentMethod } from "@prisma/client";
import axios from "axios";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

export const processPayment = async (
  paymentMethod: PaymentMethod,
  amount: number,
  lineItems: { name: string; amount: number; quantity: number }[],
  billingData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    city: string;
    country: string;
    email: string;
    state: string;
  }
) => {
  try {
    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      {
        amount,
        currency: "EGP",
        payment_methods: [paymentMethod],
        items: lineItems,
        extras: {
          ee: 22,
        },
        billing_data: billingData,
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Payment processing failed");
  }
};

export const processPaymentPostPay = async (
  success: string,
  orderId: number
) => {
  const order = await prisma.order.findFirst({
    where: { payMobOrderId: orderId },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  // Update the order status based on the payment result
  await prisma.order.update({
    where: { id: Number(orderId) },
    data: {
      status: success === "true" ? "PAID" : "FAILED",
      paid: success === "true",
    },
  });
};
