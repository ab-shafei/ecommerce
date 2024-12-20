import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/AppError";
import prisma from "../utils/prismaClient";
import { CreateUserType } from "../validations/schemas/userSchema";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const getCustomers = async () => {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { order: true },
  });
  return users;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    include: { order: true },
  });
  return users;
};

export const addUser = async (data: CreateUserType) => {
  const { email, phoneNumber, password } = data;
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    throw new AppError(400, "Email is already registered");
  }

  const existingUserByPhone = await prisma.user.findUnique({
    where: { phoneNumber },
  });
  if (existingUserByPhone) {
    throw new AppError(400, "Phone number is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return users;
};

export const modifyUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return await prisma.user.update({ where: { id }, data });
};

export const removeUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  await prisma.user.delete({ where: { id } });
};
