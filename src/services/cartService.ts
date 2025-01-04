import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

const checkProductAvailability = async (
  productId: string,
  size: string,
  color: string
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }

  const availableSize = product.size.includes(size);
  const availableColor = product.color.includes(color);

  if (!availableSize || !availableColor) {
    throw new AppError(400, "Product not available in this size or color");
  }

  return product;
};

const ensureCart = async (customerId: string) => {
  return await prisma.cart.upsert({
    where: { customerId },
    update: {},
    create: { customerId },
  });
};

const findExistingCartItem = async (
  cartId: number,
  productId: string,
  size: string,
  color: string
) => {
  return await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
      size,
      color,
    },
  });
};

const calculateCouponDiscount = async (
  cartTotalPrice: number,
  discount: number
) => {
  const discountAmount = cartTotalPrice * (discount / 100);
  const totalPriceCouponAfterDiscount = cartTotalPrice - discountAmount;

  return { discountAmount, totalPriceCouponAfterDiscount };
};

export const fetchUserCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      customerId: userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
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

  // Step 1: Check if the product exists and the size and color are available
  const product = await checkProductAvailability(productId, size, color);

  if (!product.inStock) {
    throw new AppError(400, "Not enough stock available for this product");
  }
  // Step 2: Ensure the customer has a cart
  const cart = await ensureCart(customerId);

  // Step 3: Check if the cart item already exists
  const existingCartItem = await findExistingCartItem(
    cart.id,
    productId,
    size,
    color
  );

  let cartItem;
  if (existingCartItem) {
    // Step 4: Calculate updated quantity and price
    const updatedQuantity = existingCartItem.quantity + quantity;

    const productPrice = product.price;
    const productPriceAfterDiscount = product.priceAfterDiscount;

    const cartItemTotalPrice = productPrice * updatedQuantity;
    const cartItemTotalPriceAfterDiscount =
      productPriceAfterDiscount * updatedQuantity;

    cartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: updatedQuantity,
        cartItemTotalPrice,
        cartItemTotalPriceAfterDiscount,
        size,
        color,
      },
    });
  } else {
    // Step 4: Calculate updated quantity and price

    const productPrice = product.price;
    const productPriceAfterDiscount = product.priceAfterDiscount;

    const cartItemTotalPrice = productPrice * quantity;
    const cartItemTotalPriceAfterDiscount =
      productPriceAfterDiscount * quantity;

    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        cartItemTotalPrice,
        cartItemTotalPriceAfterDiscount,
        size,
        color,
      },
    });
  }

  // Step 6: Recalculate and update the cart's total price
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    select: { cartItemTotalPrice: true, cartItemTotalPriceAfterDiscount: true },
  });

  const cartTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.cartItemTotalPrice,
    0
  );

  const cartTotalPriceAfterDiscount = cartItems.reduce(
    (acc, item) => acc + item.cartItemTotalPriceAfterDiscount,
    0
  );

  // if (cart.couponId) {
  //   const coupon = await prisma.coupon.findUnique({
  //     where: { id: cart.couponId },
  //   });
  //   if (!coupon) {
  //     throw new AppError(404, "Coupon not found");
  //   }
  //   const { totalPriceCouponAfterDiscount, discountAmount } =
  //     await calculateCouponDiscount(
  //       cartTotalPriceAfterDiscount,
  //       coupon.discount
  //     );

  //   await prisma.cart.update({
  //     where: { id: cart.id },
  //     data: {
  //       cartTotalPrice,
  //       cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
  //       discount: discountAmount,
  //     },
  //   });
  //   return {
  //     cart: {
  //       ...cart,
  //       cartTotalPrice,
  //       cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
  //       discountAmount,
  //     },
  //     cartItem,
  //   };
  // }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { cartTotalPrice, cartTotalPriceAfterDiscount },
  });

  return {
    cart: {
      ...cart,
      cartTotalPrice,
      cartTotalPriceAfterDiscount,
    },
    cartItem,
  };
};

export const updateQuantity = async (
  customerId: string,
  cartItemId: number,
  quantity: number
) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: { product: true },
  });

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  if (!cartItem.product.inStock) {
    throw new AppError(400, "Not enough stock available for this product");
  }

  const productPrice = cartItem.product.price;
  const productPriceAfterDiscount = cartItem.product.priceAfterDiscount;

  const cartItemTotalPrice = productPrice * quantity;
  const cartItemTotalPriceAfterDiscount = productPriceAfterDiscount * quantity;

  // update the cart item
  const newCartItem = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: {
      quantity,
      cartItemTotalPrice,
      cartItemTotalPriceAfterDiscount,
    },
  });

  // recalculate and update the cart
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    select: { cartItemTotalPrice: true, cartItemTotalPriceAfterDiscount: true },
  });

  const cartTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.cartItemTotalPrice,
    0
  );

  const cartTotalPriceAfterDiscount = cartItems.reduce(
    (acc, item) => acc + item.cartItemTotalPriceAfterDiscount,
    0
  );

  // if (cart.couponId) {
  //   const coupon = await prisma.coupon.findUnique({
  //     where: { id: cart.couponId },
  //   });
  //   if (!coupon) {
  //     throw new AppError(404, "Coupon not found");
  //   }
  //   const { totalPriceCouponAfterDiscount, discountAmount } =
  //     await calculateCouponDiscount(
  //       cartTotalPriceAfterDiscount,
  //       coupon.discount
  //     );

  //   await prisma.cart.update({
  //     where: { id: cart.id },
  //     data: {
  //       cartTotalPrice,
  //       cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
  //       discount: discountAmount,
  //     },
  //   });
  //   return {
  //     cart: {
  //       ...cart,
  //       cartTotalPrice,
  //       cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
  //       discountAmount,
  //     },
  //     newCartItem,
  //   };
  // }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { cartTotalPrice, cartTotalPriceAfterDiscount },
  });

  return {
    cart: {
      ...cart,
      cartTotalPrice,
      cartTotalPriceAfterDiscount,
    },
    newCartItem,
  };
};

export const applyCoupon = async ({
  customerId,
  code,
}: {
  customerId: string;
  code: string;
}) => {
  const today = new Date();
  const coupon = await prisma.coupon.findFirst({
    where: {
      code,
      start: {
        lte: today,
      },
      end: {
        gte: today,
      },
    },
  });

  if (!coupon) {
    throw new AppError(404, "Coupon not found or expired");
  }

  const usage = await prisma.couponUsage.findFirst({
    where: {
      userId: customerId,
      couponId: coupon.id,
    },
  });

  if (usage) {
    throw new AppError(400, "Coupon already used by this user");
  }

  const cart = await prisma.cart.findFirst({
    where: {
      customerId,
    },
  });

  if (!cart) {
    throw new AppError(404, "No cart found for this user");
  }

  const { cartTotalPrice, cartTotalPriceAfterDiscount } = cart;
  const { minPurchase } = coupon;

  if (minPurchase && cartTotalPrice < minPurchase) {
    throw new AppError(
      404,
      "Your cart purchase is less than coupon minimum purchase"
    );
  }

  // calculate discount
  const { totalPriceCouponAfterDiscount, discountAmount } =
    await calculateCouponDiscount(cartTotalPriceAfterDiscount, coupon.discount);

  //do all operations in a $transaction
  const [cartAfterDiscount, updatedCoupon, newUsage] =
    await prisma.$transaction([
      prisma.cart.update({
        where: {
          customerId,
        },
        data: {
          cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
          couponId: coupon.id,
          discount: discountAmount,
        },
      }),
      prisma.coupon.update({
        where: {
          code,
        },
        data: {
          numberOfUsage: { increment: 1 },
          status: "USED",
        },
      }),
      prisma.couponUsage.create({
        data: {
          userId: customerId,
          couponId: coupon.id,
        },
      }),
    ]);
  return cartAfterDiscount;
};

export const removeFromCart = async (
  customerId: string,
  cartItemId: number
) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
  });
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
    },
  });

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });

  // Step 6: Recalculate and update the cart's total price
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    select: { cartItemTotalPrice: true, cartItemTotalPriceAfterDiscount: true },
  });

  const cartTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.cartItemTotalPrice,
    0
  );

  const cartTotalPriceAfterDiscount = cartItems.reduce(
    (acc, item) => acc + item.cartItemTotalPriceAfterDiscount,
    0
  );

  // if (cart.couponId) {
  //   const coupon = await prisma.coupon.findUnique({
  //     where: { id: cart.couponId },
  //   });
  //   if (!coupon) {
  //     throw new AppError(404, "Coupon not found");
  //   }
  //   const { totalPriceCouponAfterDiscount, discountAmount } =
  //     await calculateCouponDiscount(cartTotalPrice, coupon.discount);

  //   await prisma.cart.update({
  //     where: { id: cart.id },
  //     data: {
  //       cartTotalPrice,
  //       cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
  //       discount: discountAmount,
  //     },
  //   });
  //   return {
  //     cart: {
  //       ...cart,
  //       cartTotalPrice,
  //       cartTotalPriceAfterDiscount: totalPriceCouponAfterDiscount,
  //       discountAmount,
  //     },
  //     cartItem,
  //   };
  // }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { cartTotalPrice, cartTotalPriceAfterDiscount },
  });

  return {
    cart: {
      ...cart,
      cartTotalPrice,
      cartTotalPriceAfterDiscount,
    },
    cartItem,
  };
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
    data: {
      items: { deleteMany: {} },
      cartTotalPrice: 0,
      cartTotalPriceAfterDiscount: 0,
    },
  });
};
