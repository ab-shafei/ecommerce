import fs from "fs";
import path from "path";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const resizeAndSaveCategoryImages = async (
  images: Express.Multer.File[]
) => {
  if (images) {
    const imageNames: string[] = [];
    const uploadDir = path.join(__dirname, "../../uploads/category");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    await Promise.all(
      images.map(async (img, index) => {
        const imageName = `category-${uuidv4()}-${Date.now()}-${
          index + 1
        }.jpeg`;

        await sharp(img.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/category/${imageName}`);

        imageNames.push(imageName);
      })
    );
    return imageNames;
  }
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

export const addCategory = async (
  data: { name: string },
  images: Express.Multer.File[] | undefined
) => {
  const existingCategory = await prisma.category.findFirst({
    where: { name: data.name },
  });
  if (existingCategory) {
    throw new AppError(409, "Category already exists");
  }
  const category = await prisma.category.create({ data });
  if (images) {
    const imageNames = await resizeAndSaveCategoryImages(images);
    await prisma.category.update({
      where: { id: category.id },
      data: { images: imageNames },
    });
  }
};

export const modifyCategory = async (
  id: string,
  data: { name: string },
  images: Express.Multer.File[] | undefined
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  if (images) {
    const imageNames = await resizeAndSaveCategoryImages(images);
    await prisma.category.update({
      where: { id: category.id },
      data: { images: imageNames },
    });
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
