import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";
import { sendNotification } from "../utils/mail";
import { RegisterType } from "../validations/schemas/authSchema";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (data: RegisterType) => {
  const { email, password, name, phoneNumber } = data;
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

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phoneNumber,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError(400, "Invalid credentials");

  const token = jwt.sign(
    {
      user: {
        id: user.id,
        role: user.role,
      },
    },
    JWT_SECRET,
    {
      expiresIn: "365d",
    }
  );
  return { token, user };
};

export const forgetUserPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(400, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: hash,
      resetTokenExp: new Date(Date.now() + 3600000),
    },
  });

  const mailOptions = {
    from: `"E-Commerce App" ${process.env.EMAIL}`,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
  };

  sendNotification(mailOptions);
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetTokenExp: { gte: new Date() },
    },
  });

  if (!user) throw new AppError(400, "Invalid or expired reset token");

  const isValid = await bcrypt.compare(token, user.resetToken!);
  if (!isValid) throw new AppError(400, "Invalid or expired reset token");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExp: null,
    },
  });

  return "Password reset successful";
};

export const changePassword = async (
  id: string,
  {
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) throw new AppError(400, "Wrong password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });
};
