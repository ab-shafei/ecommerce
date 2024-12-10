import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

export const fetchUserCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      customerId: userId,
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }
  return cart;
};

export const addToCart = async (
  customerId: string,
  data: { productId: string; quantity: number }
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  const cart = await prisma.cart.upsert({
    where: { customerId },
    update: {},
    create: { customerId },
  });

  // Add or update the cart item
  const cartItem = await prisma.cartItem.upsert({
    where: { cartId: cart.id, productId: data.productId },
    update: { quantity: { increment: data.quantity } },
    create: { cartId: cart.id, ...data },
  });

  return cart;
};

export const updateQuantity = async (
  customerId: string,
  data: { productId: string; quantity: number }
) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId: cart.id,
      productId: data.productId,
    },
  });

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  const newCartItem = await prisma.cartItem.update({
    where: { productId: data.productId },
    data: { quantity: data.quantity },
  });

  return newCartItem;
};

export const removeFromCart = async (
  customerId: string,
  data: { productId: string }
) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId: cart.id,
      productId: data.productId,
    },
  });

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  await prisma.cartItem.delete({
    where: {
      cartId: cart.id,
      productId: data.productId,
    },
  });
};

export const clearCartItems = async (customerId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  await prisma.cart.update({
    where: { customerId },
    data: { items: { deleteMany: {} } },
  });
};
