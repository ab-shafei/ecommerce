import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

export const getUserAddress = async (userId: string) => {
  const address = await prisma.address.findMany({
    where: {
      userId,
    },
  });

  return address;
};

export const getUserAddressById = async (userId: string, addressId: number) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
      userId,
    },
  });

  return address;
};

export const addAddress = async (data: {
  userId: string;
  name: string;
  phoneNumber: string;
  city: string;
  region: string;
  addressLine1: string;
  addressLine2: string;
  isDefault?: boolean;
}) => {
  const { userId, isDefault } = data;

  const hasAnyAddress = await prisma.address.count({
    where: { userId },
  });

  const newAddress = await prisma.address.create({
    data: {
      ...data,
      isDefault: hasAnyAddress === 0 ? true : isDefault ?? false, // Set first address as default
    },
  });

  // If the new address is marked as default, update other addresses
  if (newAddress.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
        NOT: { id: newAddress.id }, // Exclude the newly created address
      },
      data: { isDefault: false },
    });
  }

  return newAddress;
};

export const updateAddress = async (
  userId: string,
  addressId: number,
  data: {
    name?: string;
    phoneNumber?: string;
    city?: string;
    region?: string;
    addressLine1?: string;
    addressLine2?: string;
    isDefault?: boolean;
  }
) => {
  const { isDefault } = data;
  const existingAddress = await prisma.address.findUnique({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new AppError(404, "Address not found");
  }

  const address = await prisma.address.update({
    where: {
      id: addressId,
      userId,
    },
    data,
  });

  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
        NOT: {
          id: addressId,
        },
      },
      data: {
        isDefault: false,
      },
    });
  }

  return address;
};

export const deleteAddress = async (userId: string, addressId: number) => {
  const existingAddress = await prisma.address.findUnique({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new AppError(404, "Address not found");
  }
  const address = await prisma.address.delete({
    where: {
      id: addressId,
      userId,
    },
  });

  return address;
};
