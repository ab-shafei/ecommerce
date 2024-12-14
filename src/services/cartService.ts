import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import { Decimal } from "@prisma/client/runtime/library";

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
  data: { productId: string; size: string; color: string; quantity?: number }
) => {
  const { productId, size, color, quantity = 1 } = data;

  // Step 1: Fetch the product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  // Step 2: Ensure the customer has a cart
  const cart = await prisma.cart.upsert({
    where: { customerId },
    update: {},
    create: { customerId },
  });

  if (
    !product.size.some(
      (s) => s.toLocaleLowerCase() === size.toLocaleLowerCase()
    )
  ) {
    throw new AppError(404, "Size not available for this product");
  }

  if (
    !product.color.some(
      (c) => c.toLocaleLowerCase() === color.toLocaleLowerCase()
    )
  ) {
    throw new AppError(404, "Color not available for this product");
  }

  // Step 3: Check if the cart item already exists
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  const productPrice = new Decimal(product.price);

  // Step 4: Calculate updated quantity and price
  const existingQuantity = existingCartItem?.quantity || 0;
  const updatedQuantity = existingQuantity + quantity;
  const cartItemTotalPrice = productPrice.mul(updatedQuantity);

  // Step 5: Add or update the cart item
  const cartItem = await prisma.cartItem.upsert({
    where: {
      cartId: cart.id,
      productId,
    },
    update: {
      quantity: updatedQuantity,
      cartItemTotalPrice,
      size,
      color,
    },
    create: {
      cartId: cart.id,
      productId,
      size,
      color,
      quantity,
      cartItemTotalPrice,
    },
  });

  // Step 6: Recalculate and update the cart's total price
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    select: { cartItemTotalPrice: true },
  });

  const cartTotalPrice = cartItems
    .map((item) => new Decimal(item.cartItemTotalPrice))
    .reduce((acc, price) => acc.add(price), new Decimal(0));

  await prisma.cart.update({
    where: { id: cart.id },
    data: { cartTotalPrice },
  });

  return {
    cart: {
      ...cart,
      cartTotalPrice,
    },
    cartItem,
  };
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
