import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

export const fetchUserCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { customerId: userId } });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }
  return cart;
};

// export const addToCart = async (data: { name: string }) => {
//   const existingCart = await prisma.cart.findFirst({
//     where: { name: data.name },
//   });
//   if (existingCart) {
//     throw new AppError(409, "Cart already exists");
//   }
//   const cart = await prisma.cart.create({ data });
//   return cart;
// };

// export const modifyCart = async (id: string, data: { name?: string }) => {
//   const cart = await prisma.cart.findUnique({
//     where: { id },
//   });
//   if (!cart) {
//     throw new AppError(404, "Cart not found");
//   }
//   return await prisma.cart.update({ where: { id }, data });
// };

// export const removeFromCart = async (id: string) => {
//   const cart = await prisma.cart.findUnique({ where: { id } });
//   if (!cart) {
//     throw new AppError(404, "Cart not found");
//   }
//   await prisma.cart.delete({ where: { id } });
// };
