import { object, string, optional, InferInput } from "valibot";

export const ProductSubscribeSchema = object({
  productId: optional(string("Invalid productId")),
});

export const ProductSubscribeRequestSchema = object({
  body: ProductSubscribeSchema,
});

export type ProductSubscribeType = InferInput<
  typeof ProductSubscribeRequestSchema
>;
