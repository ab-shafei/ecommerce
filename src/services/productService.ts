import fs from "fs";
import path from "path";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleare";

import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

interface MulterRequest extends Request {
  files?: any;
}

export const uploadProductImages = uploadMultipleImages([{ name: "images" }]);

export const resizeProductImages = async (
  req: MulterRequest,
  _res: Response,
  next: NextFunction
) => {
  switch (req.method) {
    case "POST": {
      const product = await prisma.product.findUnique({
        where: { name: req.body.name },
      });
      if (product) {
        throw new AppError(409, "Product already exists");
      }
    }
    case "PUT": {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
      });
      if (!product) {
        throw new AppError(409, "Product not found");
      }
    }
  }
  if (req.files.images) {
    req.body.images = [];
    const uploadDir = path.join(__dirname, "../../uploads/product");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    await Promise.all(
      req.files.images.map(async (img: Buffer, index: number) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(1920, 1080)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }
  next();
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

export const addProduct = async (data: {
  name: string;
  images?: string[];
  color: string;
  size: string;
  price: number;
  categoryId: string;
}) => {
  return await prisma.product.create({ data });
};

export const modifyProduct = async (
  id: string,
  data: {
    name?: string;
    images?: string[];
    color?: string;
    size?: string;
    price?: number;
  }
) => {
  return await prisma.product.update({ where: { id }, data });
};

export const removeProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  await prisma.product.delete({ where: { id } });
};
