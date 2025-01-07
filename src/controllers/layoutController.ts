import { Request, Response, NextFunction } from "express";

import { AppError } from "../middlewares/AppError";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  getLayout,
  changeLayout,
  addBannerImage,
  deleteBannerImage,
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
  try {
    const layout = await changeLayout(req.body);
    res.status(200).json(layout);
  } catch (error) {
    next(error);
  }
};

export const addBannerImageToLayout = async (
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
    const address = await addBannerImage(req.body.categoryId, files);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteBannerImageFromLayout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const convertedBannerImageId = parseInt(req.params.id, 10);
    if (isNaN(convertedBannerImageId)) {
      throw new AppError(400, "Invalid bannerImage ID");
    }

    const bannerImage = await deleteBannerImage(convertedBannerImageId);
    res.status(200).json(bannerImage);
  } catch (error) {
    next(error);
  }
};
