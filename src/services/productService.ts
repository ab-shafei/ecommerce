import fs from "fs";
import path from "path";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Decimal } from "@prisma/client/runtime/library";

const SERVER_URL = process.env.SERVER_URL;

export const resizeAndSaveProductImages = async (
  images: Express.Multer.File[]
) => {
  if (images) {
    const imageNames: string[] = [];
    const uploadDir = path.join(__dirname, "../../uploads/product");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    await Promise.all(
      images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/product/${imageName}`);

        imageNames.push(`${SERVER_URL}/api/images/product/${imageName}`);
      })
    );
    return imageNames;
  }
};

export const fetchAllProducts = async () => {
  return await prisma.product.findMany();
};

export const fetchProductById = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  return product;
};

export const addProduct = async (
  data: {
    name: string;
    color: string;
    size: string;
    price: Decimal;
    categoryId: string;
  },
  images: Express.Multer.File[] | undefined
) => {
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
  if (images) {
    const imageNames = await resizeAndSaveProductImages(images);
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { images: imageNames },
    });
    return updatedProduct;
  }
  return product;
};

export const modifyProduct = async (
  id: string,
  data: {
    name?: string;
    color?: string;
    size?: string;
    price?: Decimal;
    categoryId?: string;
  },
  images: Express.Multer.File[] | undefined
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
  if (images) {
    const imageNames = await resizeAndSaveProductImages(images);
    await prisma.product.update({
      where: { id: product.id },
      data: { images: imageNames },
    });
  }
  return await prisma.product.update({ where: { id }, data });
};

export const removeProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  await prisma.product.delete({ where: { id } });
};
