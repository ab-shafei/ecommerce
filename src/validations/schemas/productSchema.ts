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
  categoryName: optional(string("Invalid category name")),
  color: optional(string("Invalid color")),
  size: optional(string("Invalid size")),
  inStock: optional(string("Invalid inStock")),
});

export const CreateProductSchema = object({
  name: string("Invalid name"),
  color: array(string("Invalid color")),
  size: array(string("Invalid size")),
  price: number("Invalid price"),
  inStock: optional(boolean("Invalid inStock"), true),
  homePage: optional(boolean("Invalid homPage"), false),
  categoryId: string("Invalid categoryId"),
  priceAfterDiscount: number("Invalid priceAfterDiscount"),
});

export const UpdateProductSchema = object({
  name: optional(string("Invalid name")),
  color: optional(array(string("Invalid color"))),
  size: optional(array(string("Invalid size"))),
  price: optional(number("Invalid price")),
  inStock: optional(boolean("Invalid inStock")),
  homePage: optional(boolean("Invalid homePage")),
  categoryId: optional(string("Invalid categoryId")),
  priceAfterDiscount: optional(number("Invalid priceAfterDiscount")),
});

export const UpdateProductStockSchema = object({
  productId: string("Invalid productId"),
  inStock: boolean("Invalid inStock"),
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

export const UpdateProductStockRequestSchema = object({
  body: UpdateProductStockSchema,
});

export const DeleteProductRequestSchema = object({
  params: object({
    id: pipe(string(), uuid()),
  }),
});

export type GetProductsType = InferInput<typeof GetProductsSchema>;
export type CreateProductType = InferInput<typeof CreateProductSchema>;
export type UpdateProductType = InferInput<typeof UpdateProductSchema>;
export type UpdateProductStockType = InferInput<
  typeof UpdateProductStockSchema
>;
