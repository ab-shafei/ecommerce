import { PaymentMethod, PrismaClient } from "@prisma/client";
import { processPayment } from "../services/paymentService";
import { CreateOrderType } from "../validations/schemas/orderSchema";
import { AppError } from "../middlewares/AppError";

const prisma = new PrismaClient();

const handleCashPayment = async (
  paymentMethod: PaymentMethod,
  cartId: number,
  total: number,
  data: {
    customerId: string;
    addressId: number;
    contactNumber: string;
    items: {
      name: string;
      productId: string;
      quantity: number;
      color: string;
      size: string;
      price: number;
    }[];
  }
) => {
  const order = await prisma.order.create({
    data: {
      total,
      contactNumber: data.contactNumber,
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
    },
  });
};

const handleOnlinePayment = async (
  paymentMethod: PaymentMethod,
  cartId: number,
  total: number,
  data: {
    customerId: string;
    addressId: number;
    contactNumber: string;
    items: {
      name: string;
      productId: string;
      quantity: number;
      color: string;
      size: string;
      price: number;
    }[];
  }
) => {
  const lineItems = data.items.map((item) => ({
    name: item.name,
    amount: item.price,
    quantity: item.quantity,
  }));

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

  const billingData = {
    first_name: user.name,
    last_name: user.name,
    phone_number: data.contactNumber,
    city: user.address[0].city,
    country: "Egypt",
    email: user.email,
    state: user.address[0].region,
  };
  const paymentResult = await processPayment(
    paymentMethod,
    total,
    lineItems,
    billingData
  );
  if (paymentResult.status !== "intended") {
    throw new AppError(400, "Payment processing failed");
  }
  const order = await prisma.order.create({
    data: {
      id: paymentResult.order_id,
      total,
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
    },
  });

  return {
    order,
    clientSecret: paymentResult.client_secret,
  };
};

export const getOrders = async () => {
  const orders = await prisma.order.findMany();

  return orders;
};

export const getUserOrders = async (userId: string) => {
  const order = await prisma.order.findMany({
    where: {
      customerId: userId,
    },
  });

  return order;
};

export const getOrder = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  return order;
};

/**
 * Creates an order based on the provided data.
 *
 * @param {CreateOrderType} data - The data required to create an order, including customer ID, shipping address ID, contact number, and payment method.
 * @returns {Promise<void>} - A promise that resolves when the order is successfully created.
 * @throws {AppError} - Throws an error if the cart is not found, the cart is empty, the address is not found, or the payment method is invalid.
 */
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

  const { cartTotalPrice, cartTotalPriceAfterDiscount } = cart;

  const cartTotalPriceInNumber = cartTotalPrice.toNumber();
  const cartTotalPriceAfterDiscountInNumber =
    cartTotalPriceAfterDiscount.toNumber();

  const orderTotal =
    cartTotalPriceAfterDiscountInNumber > 0
      ? cartTotalPriceAfterDiscountInNumber
      : cartTotalPriceInNumber;

  const orderTotalInCents = Math.round(orderTotal * 100);

  switch (data.paymentMethod) {
    case "CASH":
      const cashData = {
        customerId,
        addressId: address.id,
        contactNumber: data.contactNumber,
        items: cart.items.map((item) => ({
          name: item.product.name,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price:
            Math.round(item.product.price.toNumber() * 100) * item.quantity,
        })),
      };
      await handleCashPayment(
        data.paymentMethod,
        cart.id,
        orderTotalInCents,
        cashData
      );
      break;
    case "CARD":
    case "WALLET":
      const payMobData = {
        customerId,
        addressId: address.id,
        contactNumber: data.contactNumber,
        items: cart.items.map((item) => ({
          name: item.product.name,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: Math.round(item.product.price.toNumber() * 100),
        })),
      };
      const paymentData = await handleOnlinePayment(
        data.paymentMethod,
        cart.id,
        orderTotalInCents,
        payMobData
      );
      return paymentData;
    default:
      throw new AppError(400, "Invalid Payment Method");
  }
};
