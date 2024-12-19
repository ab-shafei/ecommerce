import {
  array,
  boolean,
  decimal,
  object,
  pipe,
  string,
  optional,
  InferInput,
  uuid,
} from "valibot";

export const CreateProductSchema = object({
  name: string(),
  color: array(string()),
  size: array(string()),
  price: pipe(string(), decimal()),
  inStock: optional(boolean(), true),
  categoryId: string(),
  priceAfterDiscount: optional(pipe(string(), decimal())),
});

export const UpdateProductSchema = object({
  name: optional(string()),
  color: optional(array(string())),
  size: optional(array(string())),
  price: optional(pipe(string(), decimal())),
  inStock: optional(boolean()),
  categoryId: optional(string()),
  priceAfterDiscount: optional(pipe(string(), decimal())),
});

export const CreateProductRequestSchema = object({
  body: UpdateProductSchema,
});

export const UpdateProductRequestSchema = object({
  params: object({
    id: pipe(string(), uuid()),
  }),
  body: UpdateProductSchema,
});

export const DeleteProductRequestSchema = object({
  params: object({
    id: pipe(string(), uuid()),
  }),
});

export type CreateProductType = InferInput<typeof CreateProductSchema>;
export type UpdateProductType = InferInput<typeof UpdateProductSchema>;
