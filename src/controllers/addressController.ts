import { Request, Response, NextFunction } from "express";

import { AppError } from "../middlewares/AppError";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { validatePhoneNumber } from "../utils/validate";
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

  const {
    name,
    phoneNumber,
    city,
    region,
    addressLine1,
    addressLine2,
    isDefault,
  } = req.body;

  try {
    if (!name || !phoneNumber || !city || !region || !addressLine1) {
      throw new AppError(400, "Missing required fields");
    }

    if (!validatePhoneNumber(phoneNumber)) {
      throw new AppError(
        400,
        'Invalid phone number format. It should start with "+" and include 10-15 digits'
      );
    }
    const user = await addAddress({
      userId: id,
      name,
      phoneNumber,
      city,
      region,
      addressLine1,
      addressLine2,
      isDefault,
    });
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
  const {
    name,
    phoneNumber,
    city,
    region,
    addressLine1,
    addressLine2,
    isDefault,
  } = req.body;

  try {
    const convertedAddressId = parseInt(addressId, 10);
    if (isNaN(convertedAddressId)) {
      throw new AppError(400, "Invalid address ID");
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      throw new AppError(
        400,
        'Invalid phone number format. It should start with "+" and include 10-15 digits'
      );
    }
    const address = await updateAddress(userId, convertedAddressId, {
      name,
      phoneNumber,
      city,
      region,
      addressLine1,
      addressLine2,
      isDefault,
    });
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
