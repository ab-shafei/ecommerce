import prisma from "../utils/prismaClient";
import resizeAndSaveImages from "../utils/resizeAndSaveImages";
import { ChangeLayoutType } from "../validations/schemas/layoutSchema";

export const getLayout = async () => {
  const address = await prisma.layout.findFirst();
  return address;
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

export const changeImagesOfLayout = async (files: Express.Multer.File[]) => {
  const { imageURLs } = await resizeAndSaveImages("layout", "layout", files);
  const layout = await prisma.layout.upsert({
    where: {
      id: 1,
    },
    update: {
      images: imageURLs,
    },
    create: {
      images: imageURLs,
    },
  });
  return layout;
};
