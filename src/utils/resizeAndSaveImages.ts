import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const SERVER_URL = process.env.SERVER_URL;

export type ImageType = "product" | "category" | "layout";

export default async function resizeAndSaveImages(
  imagePrefix: string,
  type: ImageType,
  files: Express.Multer.File[]
) {
  const imageURLs: string[] = [];
  const uploadDir = path.join(__dirname, `../../uploads/${type}`);
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
        .toFile(`uploads/${type}/${imageName}`);

      imageURLs.push(`${SERVER_URL}/api/images/${type}/${imageName}`);
    })
  );

  return { imageURLs };
}
