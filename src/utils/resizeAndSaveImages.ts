import sharp from "sharp";
import { supabase } from "./supabase";
import unique from "uniqid";

export default async function resizeAndSaveImages(
  prefix: string,
  files: Express.Multer.File[]
) {
  const imageURLs: string[] = [];

  await Promise.all(
    files.map(async (file, index) => {
      // Resize the image using sharp
      const buffer = await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toBuffer();

      // Upload to Supabase storage
      const uniqueID = unique(prefix);
      const filePath = `${uniqueID}.jpeg`;
      const { error } = await supabase.storage
        .from("images") // Replace with your bucket name
        .upload(`${filePath}`, buffer, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Error uploading file to Supabase:", error);
        throw new Error("Failed to upload file");
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(`${filePath}`);

      console.log(data);

      if (!data) {
        throw new Error("Failed to upload file");
      }

      imageURLs.push(data.publicURL);
    })
  );

  return { imageURLs };
}
