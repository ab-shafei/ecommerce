import { NextFunction, Request, Response } from "express";
import {
  addCategory,
  fetchAllCategorys,
  fetchCategoryById,
  modifyCategory,
  removeCategory,
  uploadImages,
} from "../services/categoryService";
import { AppError } from "../middlewares/AppError";

const allowedUploadTypes = ["images"];

export const getAllCategorys = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categorys = await fetchAllCategorys();
    res.status(200).json(categorys);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category = await fetchCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const category = await addCategory({
      name,
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const uploadCategoryImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { uploadType } = req.query;
  const { files } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (typeof uploadType !== "string") {
    throw new AppError(400, "Upload type must be a string");
  }
  const isAllowedUploadType = allowedUploadTypes.includes(uploadType);
  if (!isAllowedUploadType) throw new AppError(400, "Upload type not allowed");

  try {
    await uploadImages({ id, uploadType, files });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await modifyCategory(id, {
      name,
    });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await removeCategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
