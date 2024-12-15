import { NextFunction, Request, Response } from "express";
import {
  addCoupon,
  fetchAllCoupons,
  fetchCouponById,
  modifyCoupon,
  removeCoupon,
} from "../services/couponServices";
import { AppError } from "../middlewares/AppError";

export const getAllCoupons = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupons = await fetchAllCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const couponId = parseInt(id, 10);
    if (isNaN(couponId)) {
      throw new AppError(400, "Invalid coupon ID");
    }

    const coupon = await fetchCouponById(couponId);
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, discount, start, end, minPurchase } = req.body;

    if (!code || !discount || !start || !end) {
      throw new AppError(400, "Missing required fields");
    }

    if (isNaN(parseInt(discount, 10))) {
      throw new AppError(400, "Invalid value for 'discount', must be a number");
    }

    if (isNaN(Date.parse(start))) {
      throw new AppError(400, "Invalid date for 'start'");
    }
    if (isNaN(Date.parse(end))) {
      throw new AppError(400, "Invalid date for 'end'");
    }

    // Step 2: Ensure expiresAt is in the future
    const startDate = new Date(start); // Convert to Date object
    const endDate = new Date(end); // Convert to Date object
    const now = new Date();

    if (endDate <= now || startDate >= endDate) {
      throw new AppError(400, "'end' must be a future date");
    }

    const coupon = await addCoupon({
      code,
      discount,
      start: startDate,
      end: endDate,
      minPurchase,
    });
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { code, discount, start, end, minPurchase } = req.body;

    const couponId = parseInt(id, 10);
    if (isNaN(couponId)) {
      throw new AppError(400, "Invalid coupon ID");
    }

    if (discount && isNaN(parseInt(discount, 10))) {
      throw new AppError(400, "Invalid value for 'discount', must be a number");
    }

    if (isNaN(Date.parse(start))) {
      throw new AppError(400, "Invalid date for 'start'");
    }
    if (isNaN(Date.parse(end))) {
      throw new AppError(400, "Invalid date for 'end'");
    }

    // Step 2: Ensure expiresAt is in the future
    const startDate = new Date(start); // Convert to Date object
    const endDate = new Date(end); // Convert to Date object
    const now = new Date();

    if (endDate <= now || startDate >= endDate) {
      throw new AppError(400, "'end' must be a future date");
    }

    const coupon = await modifyCoupon(couponId, {
      code,
      discount,
      start: startDate,
      end: endDate,
      minPurchase,
    });
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const couponId = parseInt(id, 10);
    if (isNaN(couponId)) {
      throw new AppError(400, "Invalid coupon ID");
    }

    await removeCoupon(couponId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
