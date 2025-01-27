import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import resizeAndSaveImages from "../utils/resizeAndSaveImages";

export const fetchAllCategories = async () => {
  return await prisma.category.findMany();
};

export const fetchCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });
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
      const { imageURLs } = await resizeAndSaveImages("category", files);
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
