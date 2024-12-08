import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "../utils/prismaClient";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from "../utils/validate";
import { AppError } from "../middlewares/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phoneNumber: string
) => {
  if (!email || !password || !name || !phoneNumber) {
    throw new AppError(400, "Missing required fields");
  }

  // Validate the email format
  if (!validateEmail(email)) {
    throw new AppError(400, "Invalid email format");
  }

  // Validate the password strength
  if (!validatePassword(password)) {
    throw new AppError(
      400,
      "Password must be at least 8 characters long and include at least one letter and one number"
    );
  }

  // Validate the name
  if (!validateName(name)) {
    throw new AppError(400, "Name must be at least 2 characters long");
  }

  // Validate the phone number format
  if (!validatePhoneNumber(phoneNumber)) {
    throw new AppError(
      400,
      'Invalid phone number format. It should start with "+" and include 10-15 digits'
    );
  }

  // Check if the email is already registered
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    throw new AppError(400, "Email is already registered");
  }

  //   // Check if the phone number is already registered
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
      resetTokenExp: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw new AppError(500, "Error sending email");
    }
    return "Password reset email sent";
  });
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

  // Validate the password strength
  if (!validatePassword(newPassword)) {
    throw new AppError(
      400,
      "Password must be at least 8 characters long and include at least one letter and one number"
    );
  }

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
