import fs from "fs";
import path from "path";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Decimal } from "@prisma/client/runtime/library";

const SERVER_URL = process.env.SERVER_URL;

export const resizeAndSaveProductImages = async (
  imagePrefix: string,
  files: Express.Multer.File[]
) => {
  const imageURLs: string[] = [];
  const uploadDir = path.join(__dirname, "../../uploads/product");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  await Promise.all(
    files.map(async (img, index) => {
      const imageName = `${imagePrefix}-${uuidv4()}-${Date.now()}-${
        index + 1
      }.jpeg`;

      await sharp(img.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/product/${imageName}`);

      imageURLs.push(`${SERVER_URL}/api/images/product/${imageName}`);
    })
  );

  return { imageURLs };
};

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
      const { imageURLs } = await resizeAndSaveProductImages("product", files);
      return await prisma.product.update({
        where: { id },
        data: { images: imageURLs },
      });
    case "dimensionsImages":
      const { imageURLs: dimensionsImages } = await resizeAndSaveProductImages(
        "product-dimensions",
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
