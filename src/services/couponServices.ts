import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import { Decimal } from "@prisma/client/runtime/library";

export const fetchAllCoupons = async () => {
  return await prisma.coupon.findMany();
};

export const fetchCouponById = async (id: number) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw new AppError(404, "Coupon not found");
  }
  return coupon;
};

export const addCoupon = async (data: {
  code: string;
  discount: number;
  start: Date;
  end: Date;
  minPurchase?: Decimal;
}) => {
  const existingCoupon = await prisma.coupon.findFirst({
    where: { code: data.code },
  });
  if (existingCoupon) {
    throw new AppError(409, "Coupon already exists");
  }
  const coupon = await prisma.coupon.create({ data });

  return coupon;
};

export const modifyCoupon = async (
  id: number,
  data: {
    code?: string;
    discount?: number;
    start?: Date;
    end?: Date;
    minPurchase?: Decimal;
  }
) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });
  if (!coupon) {
    throw new AppError(404, "Coupon not found");
  }
  return await prisma.coupon.update({ where: { id }, data });
};

export const removeCoupon = async (id: number) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw new AppError(404, "Coupon not found");
  }
  await prisma.coupon.delete({ where: { id } });
};
