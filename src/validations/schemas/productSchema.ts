import {
  array,
  boolean,
  object,
  pipe,
  string,
  optional,
  InferInput,
  uuid,
  number,
} from "valibot";

export const GetProductsSchema = object({
  categoryName: optional(string()),
  color: optional(string()),
  size: optional(string()),
  inStock: optional(string()),
});

export const CreateProductSchema = object({
  name: string(),
  color: array(string()),
  size: array(string()),
  price: number(),
  inStock: optional(boolean(), true),
  homePage: optional(boolean(), false),
  categoryId: string(),
  priceAfterDiscount: number(),
});

export const UpdateProductSchema = object({
  name: optional(string()),
  color: optional(array(string())),
  size: optional(array(string())),
  price: optional(number()),
  inStock: optional(boolean()),
  homePage: optional(boolean()),
  categoryId: optional(string()),
  priceAfterDiscount: optional(number()),
});

export const GetProductsRequestSchema = object({
  query: GetProductsSchema,
});

export const CreateProductRequestSchema = object({
  body: CreateProductSchema,
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

export type GetProductsType = InferInput<typeof GetProductsSchema>;
export type CreateProductType = InferInput<typeof CreateProductSchema>;
export type UpdateProductType = InferInput<typeof UpdateProductSchema>;
