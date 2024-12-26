import { NextFunction, Request, Response } from "express";
import {
  addReview,
  getReviews,
  moderateReview,
} from "../services/reviewService";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.query;

  try {
    const reviews = await getReviews(productId as string);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const addProductReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { productId, rating, comment } = req.body;

  try {
    const review = await addReview({
      userId: req.user!.id,
      productId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const moderateProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reviewId, status } = req.body;

  try {
    const review = await moderateReview({ reviewId, status });

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};
