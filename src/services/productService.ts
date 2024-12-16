import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import { Decimal } from "@prisma/client/runtime/library";
import resizeAndSaveImages from "../utils/resizeAndSaveImages";

export const fetchAllProducts = async () => {
  return await prisma.product.findMany();
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

export const addProduct = async (data: {
  name: string;
  color: string[];
  size: string[];
  price: Decimal;
  priceAfterDiscount?: Decimal;
  categoryId: string;
  inStock?: boolean;
}) => {
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
      const { imageURLs } = await resizeAndSaveImages("", "product", files);
      return await prisma.product.update({
        where: { id },
        data: { images: imageURLs },
      });
    case "dimensionsImages":
      const { imageURLs: dimensionsImages } = await resizeAndSaveImages(
        "product-dimensions",
        "product",
        files
      );
      return await prisma.product.update({
        where: { id },
        data: { dimensionsImages },
      });
    default:
  }
};

export const modifyProduct = async (
  id: string,
  data: {
    name?: string;
    color?: string[];
    size?: string[];
    price?: Decimal;
    inStock?: boolean;
    priceAfterDiscount?: Decimal;
    categoryId?: string;
  }
) => {
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
