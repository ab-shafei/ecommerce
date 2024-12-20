import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/AppError";
import {
  addUser,
  getCustomers,
  getUsers,
  modifyUser,
  removeUser,
} from "../services/userservice";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await addUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await getCustomers();
    res.status(200).send(customers);
  } catch (error) {
    next(error);
  }
};

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
