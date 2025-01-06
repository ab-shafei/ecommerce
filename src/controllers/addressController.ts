import { Response, NextFunction } from "express";

import { AppError } from "../middlewares/AppError";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  addAddress,
  deleteAddress,
  getUserAddress,
  getUserAddressById,
  updateAddress,
} from "../services/addressService";

export const getLoggedUserAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user!;

  try {
    const address = await getUserAddress(id);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const getLoggedUserAddressById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user!;
  const { addressId } = req.params;

  try {
    const convertedAddressId = parseInt(addressId, 10);
    if (isNaN(convertedAddressId)) {
      throw new AppError(400, "Invalid address ID");
    }
    const address = await getUserAddressById(userId, convertedAddressId);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const addUserAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user!;

  try {
    const user = await addAddress({ userId: id, ...req.body });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user!;
  const { addressId } = req.params;

  try {
    const convertedAddressId = parseInt(addressId, 10);
    if (isNaN(convertedAddressId)) {
      throw new AppError(400, "Invalid address ID");
    }

    const address = await updateAddress(userId, convertedAddressId, req.body);
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteUserAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user!;
  const { addressId } = req.params;

  try {
    const convertedAddressId = parseInt(addressId, 10);
    if (isNaN(convertedAddressId)) {
      throw new AppError(400, "Invalid address ID");
    }
    const address = await deleteAddress(userId, convertedAddressId);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};
