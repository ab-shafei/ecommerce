import { PaymentMethod } from "@prisma/client";
import { AppError } from "../middlewares/AppError";

export const getPaymobIntegrationId = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case "WALLET":
      return Number(process.env.PAYMOB_WALLET_INTEGRATION_ID!);
    case "CARD":
      return Number(process.env.PAYMOB_CARD_INTEGRATION_ID!);
    default:
      throw new AppError(400, "Invalid payment method");
  }
};
