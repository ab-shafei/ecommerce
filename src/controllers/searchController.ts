import { NextFunction, Request, Response } from "express";
import { fetchAllCategoriesAndProducts } from "../services/searchService";
import { AppError } from "../middlewares/AppError";

export const getAllCategoriesAndProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;

    if (typeof search !== "string") {
      throw new AppError(400, "Must provide a vaild search key");
    }

    const data = await fetchAllCategoriesAndProducts(search);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
