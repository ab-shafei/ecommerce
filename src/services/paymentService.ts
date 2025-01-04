import { PaymentMethod } from "@prisma/client";
import axios from "axios";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

export const processPayment = async (
  paymobIntegrationId: number,
  amount: number,
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
      `${process.env.PAYMOB_API_URL}/intention`,
      {
        amount,
        currency: "EGP",
        payment_methods: [paymobIntegrationId],
        billing_data: billingData,
        notification_url: `${process.env.API_URL}/payments/acceptance/post_pay`,
        redirection_url: `${process.env.CLIENT_URL}/payments/acceptance/post_pay`,
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Payment processing failed");
  }
};

export const processPaymentPostPay = async (
  success: boolean,
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
    where: { payMobOrderId: orderId },
    data: {
      status: success === true ? "PAID" : "FAILED",
      paid: success === true,
    },
  });
};
