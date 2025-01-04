import { PaymentMethod, PrismaClient } from "@prisma/client";
import { processPayment } from "../services/paymentService";
import {
  CreateOrderType,
  UpdateOrderType,
} from "../validations/schemas/orderSchema";
import { AppError } from "../middlewares/AppError";
import { getPaymobIntegrationId } from "../utils/payMob";

const prisma = new PrismaClient();

const handleCashPayment = async (
  paymentMethod: PaymentMethod,
  cartId: number,
  data: {
    orderTotal: number;
    customerId: string;
    addressId: number;
    contactNumber: string;
    shippingAmount?: number;
    shippingLocation?: string;
    items: {
      name: string;
      productId: string;
      quantity: number;
      color: string;
      size: string;
      price: number;
      priceAfterDiscount: number;
    }[];
  }
) => {
  const order = await prisma.order.create({
    data: {
      total: data.orderTotal,
      contactNumber: data.contactNumber,
      shippingAmount: data.shippingAmount,
      shippingLocation: data.shippingLocation,
      shippingAddressId: data.addressId,
      customerId: data.customerId,
      paymentMethod,
      status: "PROCESSING",
    },
  });

  // create order items
  await prisma.orderItem.createMany({
    data: data.items.map((item) => ({
      ...item,
      orderId: order.id,
    })),
  });

  await prisma.cartItem.deleteMany({
    where: {
      cartId,
    },
  });

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      cartTotalPrice: 0,
      cartTotalPriceAfterDiscount: 0,
      couponId: null,
      discount: 0,
    },
  });
};

const handleOnlinePayment = async (
  paymentMethod: PaymentMethod,
  cartId: number,
  data: {
    orderTotal: number;
    customerId: string;
    addressId: number;
    contactNumber: string;
    shippingAmount?: number;
    shippingLocation?: string;
    items: {
      name: string;
      productId: string;
      quantity: number;
      color: string;
      size: string;
      price: number;
      priceAfterDiscount: number;
    }[];
  }
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: data.customerId,
    },
    include: {
      address: {
        where: {
          id: data.addressId,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.address || user.address.length === 0) {
    throw new AppError(400, "Address not found");
  }

  const billingData = {
    first_name: user.name,
    last_name: user.name,
    phone_number: data.contactNumber,
    city: user.address[0].city,
    country: "Egypt",
    email: user.email,
    state: user.address[0].region,
  };

  const orderTotalInCents = Math.round(data.orderTotal * 100);

  const paymobIntegrationId = getPaymobIntegrationId(paymentMethod);

  const paymentResult = await processPayment(
    paymobIntegrationId,
    orderTotalInCents,
    billingData
  );
  if (paymentResult.status !== "intended") {
    throw new AppError(400, "Payment processing failed");
  }
  const order = await prisma.order.create({
    data: {
      total: data.orderTotal,
      shippingAmount: data.shippingAmount,
      shippingLocation: data.shippingLocation,
      contactNumber: data.contactNumber,
      shippingAddressId: data.addressId,
      customerId: data.customerId,
      paymentMethod,
      status: "PROCESSING",
      paymentIntentId: paymentResult.id,
      payMobOrderId: paymentResult.intention_order_id,
    },
  });

  // create order items
  await prisma.orderItem.createMany({
    data: data.items.map((item) => ({
      ...item,
      orderId: order.id,
    })),
  });

  await prisma.cartItem.deleteMany({
    where: {
      cartId,
    },
  });

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      cartTotalPrice: 0,
      cartTotalPriceAfterDiscount: 0,
      couponId: null,
      discount: 0,
    },
  });

  return {
    order,
    paymentResult,
    paymentLink: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${paymentResult.client_secret}`,
  };
};

export const getOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            select: {
              images: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  return orders;
};

export const getUserOrders = async (userId: string) => {
  const order = await prisma.order.findMany({
    where: {
      customerId: userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              images: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  return order;
};

export const getOrder = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              images: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
};

export const createOrder = async (
  customerId: string,
  data: CreateOrderType
) => {
  const cart = await prisma.cart.findFirst({
    where: {
      customerId,
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

  if (cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  const address = await prisma.address.findUnique({
    where: {
      id: data.shippingAddressId,
    },
  });

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  const { cartTotalPriceAfterDiscount } = cart;
  const cartTotalPriceAfterDiscountInNumber = cartTotalPriceAfterDiscount;

  const orderTotal =
    cartTotalPriceAfterDiscountInNumber + (data.shippingAmount || 0);

  switch (data.paymentMethod) {
    case "CASH":
      const cashData = {
        orderTotal,
        customerId,
        addressId: address.id,
        contactNumber: data.contactNumber,
        shippingAmount: data.shippingAmount,
        shippingLocation: data.shippingLocation,
        items: cart.items.map((item) => ({
          name: item.product.name,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: Math.round(item.cartItemTotalPrice),
          priceAfterDiscount: Math.round(item.cartItemTotalPriceAfterDiscount),
        })),
      };
      await handleCashPayment(data.paymentMethod, cart.id, cashData);
      break;
    case "CARD":
    case "WALLET":
      const payMobData = {
        orderTotal,
        customerId,
        addressId: address.id,
        contactNumber: data.contactNumber,
        shippingAmount: data.shippingAmount,
        shippingLocation: data.shippingLocation,
        items: cart.items.map((item) => ({
          name: item.product.name,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: Math.round(item.cartItemTotalPrice),
          priceAfterDiscount: Math.round(item.cartItemTotalPriceAfterDiscount),
        })),
      };

      const paymentData = await handleOnlinePayment(
        data.paymentMethod,
        cart.id,
        payMobData
      );
      return paymentData;
    default:
      throw new AppError(400, "Invalid Payment Method");
  }
};

export const updateOrder = async (orderId: number, data: UpdateOrderType) => {
  const existingOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!existingOrder) {
    throw new AppError(404, "Order not found");
  }

  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data,
  });

  return order;
};

export const deleteOrder = async (orderId: number) => {
  const existingOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!existingOrder) {
    throw new AppError(404, "Order not found");
  }

  const order = await prisma.order.delete({
    where: {
      id: orderId,
    },
  });

  return order;
};
