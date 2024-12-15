import { Request } from "express";
import multer, { Field, FileFilterCallback } from "multer";
import { AppError } from "./AppError";

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Accept image only
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    }
    throw new AppError(400, "Not an image! Please upload an image.");
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

export const uploadSingleImage = (fieldName: string) =>
  multerOptions().single(fieldName);

export const uploadMultipleImages = (arrayOfFields: Field[]) =>
  multerOptions().fields(arrayOfFields);
