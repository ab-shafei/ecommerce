import { Router } from "express";
import {
  addUserAddress,
  deleteUserAddress,
  getLoggedUserAddress,
  getLoggedUserAddressById,
  updateUserAddress,
} from "../controllers/addressController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import {
  addAddressValidation,
  updateAddressValidation,
} from "../validations/addressValidation";

const router = Router();

router.get(
  "/",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  getLoggedUserAddress
);

router.get(
  "/:addressId",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  getLoggedUserAddressById
);

router.post(
  "/",
  addAddressValidation,
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  addUserAddress
);

router.put(
  "/:addressId",
  updateAddressValidation,
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  updateUserAddress
);

router.delete(
  "/:addressId",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  deleteUserAddress
);

export default router;
