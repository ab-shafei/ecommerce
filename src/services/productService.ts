import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import resizeAndSaveImages from "../utils/resizeAndSaveImages";
import {
  CreateProductType,
  GetProductsType,
  UpdateProductType,
} from "../validations/schemas/productSchema";
import { notifyUsers } from "./notificationService";

export const fetchAllProducts = async (filter: GetProductsType) => {
  const { categoryName, color, size, inStock } = filter;

  const whereClause: any = {};

  if (size) {
    whereClause.size = { has: size };
  }

  if (color) {
    whereClause.color = { has: color };
  }

  if (categoryName) {
    whereClause.category = {
      name: categoryName,
    };
  }

  whereClause.inStock =
    inStock === "true" ? true : inStock === "false" ? false : undefined;

  return await prisma.product.findMany({
    where: whereClause,
  });
};

export const fetchProductById = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, "Product not found");
  }

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id }, // Exclude the current product
    },
    take: 5, // Limit the number of related products
  });

  return { product, relatedProducts };
};

export const addProduct = async (data: CreateProductType) => {
  const existingProduct = await prisma.product.findFirst({
    where: { name: data.name },
  });
  if (existingProduct) {
    throw new AppError(409, "Product name already exists");
  }
  const categoryExist = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!categoryExist) {
    throw new AppError(409, "Product category doesn't exists");
  }

  const { price, priceAfterDiscount } = data;
  if (priceAfterDiscount && price < priceAfterDiscount) {
    throw new AppError(409, "Price can't be less than priceAfterDiscount");
  } else if (!priceAfterDiscount) {
    data.priceAfterDiscount = price;
  }

  const product = await prisma.product.create({ data });

  return product;
};

export const uploadImages = async ({
  id,
  uploadType,
  files,
}: {
  id: string;
  uploadType: string;
  files: Express.Multer.File[];
}) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  switch (uploadType) {
    case "images":
      const { imageURLs } = await resizeAndSaveImages("product", files);
      return await prisma.product.update({
        where: { id },
        data: { images: imageURLs },
      });
    case "dimensionsImages":
      const { imageURLs: dimensionsImages } = await resizeAndSaveImages(
        "product-dimension",
        files
      );
      return await prisma.product.update({
        where: { id },
        data: { dimensionsImages },
      });
    default:
  }
};

export const modifyProduct = async (id: string, data: UpdateProductType) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  if (data.categoryId) {
    const categoryExist = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!categoryExist) {
      throw new AppError(409, "Product category doesn't exists");
    }
  }
  const price = product.price;
  const { priceAfterDiscount } = data;
  if (priceAfterDiscount && price < priceAfterDiscount) {
    throw new AppError(409, "Price can't be less than priceAfterDiscount");
  }

  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const removeProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  await prisma.product.delete({ where: { id } });
};

export const modifyProductStock = async (
  productId: string,
  inStock: boolean
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  await prisma.product.update({
    where: { id: productId },
    data: { inStock },
  });

  // If the product was out of stock and is now available, trigger notifications
  if (inStock) {
    await notifyUsers(productId);
  }
};
