import { OrderStatus, PaymentMethod } from "@prisma/client";
import {
  object,
  pipe,
  string,
  optional,
  InferInput,
  regex,
  enum as venum,
  number,
  date,
  boolean,
} from "valibot";

export const CreateOrderSchema = object({
  shippingAmount: optional(number("Shipping amount is invalid"), 0),
  shippingLocation: optional(string("Shipping location is invalid")),
  contactNumber: pipe(
    string("Enter phone number"),
    regex(/^01\d{9}/, "Phone number must be 11 numbers starting with 01")
  ),
  paymentMethod: venum(PaymentMethod, "Invalid Payment Method"),
  shippingAddressId: number("shippingAddressId not provided"),
});

export const UpdateOrderSchema = object({
  status: optional(venum(OrderStatus, "Invalid Order Status")),
  trackingNumber: optional(string()),
  estimatedDelivery: optional(date()),
  paid: optional(boolean()),
});

export const CreateOrderRequestSchema = object({
  body: CreateOrderSchema,
});

export const UpdateOrderRequestSchema = object({
  body: UpdateOrderSchema,
});

export type CreateOrderType = InferInput<typeof CreateOrderSchema>;
export type UpdateOrderType = InferInput<typeof UpdateOrderSchema>;
