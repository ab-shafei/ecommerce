import { NextFunction, Request, Response } from "express";
import {
  addCategory,
  fetchAllCategorys,
  fetchCategoryById,
  modifyCategory,
  removeCategory,
} from "../services/categoryService";

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
    const { images } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const category = await addCategory(
      {
        name,
      },
      images
    );
    res.status(201).json(category);
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
    const { images } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const category = await modifyCategory(
      id,
      {
        name,
      },
      images
    );
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
