import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/AppError";
import { modifyUser, removeUser } from "../services/userservice";

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phoneNumber } = req.body;
  try {
    const user = await modifyUser(id, {
      email,
      name,
      phoneNumber,
    });
    res.status(200).json(user);
  } catch (error) {
    throw new AppError(500, "Failed to update user");
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await removeUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
