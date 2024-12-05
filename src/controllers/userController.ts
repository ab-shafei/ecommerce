import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { AppError } from "../middlewares/AppError";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    throw new AppError(500, "Failed to fetch users");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, "User not found");
    res.status(200).json(user);
  } catch (error) {
    throw new AppError(500, "Failed to fetch user");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, phoneNumber } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email, name, phoneNumber },
    });
    res.status(200).json(user);
  } catch (error) {
    throw new AppError(500, "Failed to update user");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    throw new AppError(500, "Failed to delete user");
  }
};
