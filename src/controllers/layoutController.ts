import { Request, Response, NextFunction } from "express";

import { AppError } from "../middlewares/AppError";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  getLayout,
  changeLayout,
  changeImagesOfLayout,
} from "../services/layoutService";

export const getWebsiteLayout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = await getLayout();
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const changeWebsiteLayout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, paragraph, contactEmail, contactPhoneNumber } = req.body;

  try {
    if (!title && !paragraph && !contactEmail && !contactPhoneNumber) {
      throw new AppError(
        400,
        "Please provide at least one field (title, paragraph, contactEmail, contactPhoneNumber)"
      );
    }
    const address = await changeLayout({
      title,
      paragraph,
      contactEmail,
      contactPhoneNumber,
    });
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const changeImagesOFWebsiteLayout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { files } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  try {
    if (!files) {
      throw new AppError(400, "Please upload files");
    }
    const address = await changeImagesOfLayout(files);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};
