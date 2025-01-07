import { AppError } from "../middlewares/AppError";
import prisma from "../utils/prismaClient";
import resizeAndSaveImages from "../utils/resizeAndSaveImages";
import { ChangeLayoutType } from "../validations/schemas/layoutSchema";

export const getLayout = async () => {
  const layout = await prisma.layout.findFirst({
    include: {
      images: true,
    },
  });
  return layout;
};

export const changeLayout = async (data: ChangeLayoutType) => {
  const layout = await prisma.layout.upsert({
    where: {
      id: 1,
    },
    update: {
      ...data,
    },
    create: {
      ...data,
    },
  });
  return layout;
};

export const addBannerImage = async (
  categoryId: string,
  files: Express.Multer.File[]
) => {
  const { imageURLs } = await resizeAndSaveImages("layout", "layout", files);

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError(404, "category not found");
  }

  const layout = await prisma.layout.findFirst();

  const bannerImage = await prisma.bannerImage.create({
    data: {
      categoryId,
      image: imageURLs,
      layoutId: layout!.id,
    },
  });

  return bannerImage;
};

export const deleteBannerImage = async (bannerImageId: number) => {
  const bannerImage = await prisma.bannerImage.findUnique({
    where: {
      id: bannerImageId,
    },
  });

  if (!bannerImage) {
    throw new AppError(404, "bannerImage not found");
  }

  const deletedBannerImage = await prisma.bannerImage.delete({
    where: {
      id: bannerImageId,
    },
  });

  return deletedBannerImage;
};
