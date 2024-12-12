import fs from "fs";
import path from "path";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const SERVER_URL = process.env.SERVER_URL;

export const resizeAndSaveCategoryImages = async (
  imagePrefix: string,
  files: Express.Multer.File[]
) => {
  const imageURLs: string[] = [];
  const uploadDir = path.join(__dirname, "../../uploads/category");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  await Promise.all(
    files.map(async (img, index) => {
      const imageURL = `${imagePrefix}-${uuidv4()}-${Date.now()}-${
        index + 1
      }.jpeg`;

      await sharp(img.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/category/${imageURL}`);

      imageURLs.push(`${SERVER_URL}/api/images/category/${imageURL}`);
    })
  );
  return { imageURLs };
};

export const fetchAllCategorys = async () => {
  return await prisma.category.findMany();
};

export const fetchCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  return category;
};

export const addCategory = async (data: { name: string }) => {
  const existingCategory = await prisma.category.findFirst({
    where: { name: data.name },
  });
  if (existingCategory) {
    throw new AppError(409, "Category already exists");
  }
  const category = await prisma.category.create({ data });

  return category;
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
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  switch (uploadType) {
    case "images":
      const { imageURLs } = await resizeAndSaveCategoryImages(
        "category",
        files
      );
      return await prisma.category.update({
        where: { id },
        data: { images: imageURLs },
      });
    default:
  }
};

export const modifyCategory = async (id: string, data: { name?: string }) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  return await prisma.category.update({ where: { id }, data });
};

export const removeCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  await prisma.category.delete({ where: { id } });
};
