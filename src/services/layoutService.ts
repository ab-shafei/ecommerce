import prisma from "../utils/prismaClient";
import resizeAndSaveImages from "../utils/resizeAndSaveImages";

export const getLayout = async () => {
  const address = await prisma.layout.findFirst();
  return address;
};

export const changeLayout = async (data: {
  title?: string;
  paragraph?: string;
  contactEmail?: string;
  contactPhoneNumber?: string;
}) => {
  const { title, paragraph, contactEmail, contactPhoneNumber } = data;
  const layout = await prisma.layout.upsert({
    where: {
      id: 1,
    },
    update: {
      title,
      paragraph,
      contactEmail,
      contactPhoneNumber,
    },
    create: {
      title,
      paragraph,
      contactEmail,
      contactPhoneNumber,
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
