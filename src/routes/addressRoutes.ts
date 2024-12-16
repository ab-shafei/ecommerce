import { Router } from "express";
import {
  addUserAddress,
  deleteUserAddress,
  getLoggedUserAddress,
  getLoggedUserAddressById,
  updateUserAddress,
} from "../controllers/addressController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  getLoggedUserAddress
);

router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  getLoggedUserAddressById
);

router.post("/", authenticateJWT, authorizeRoles("CUSTOMER"), addUserAddress);

router.put(
  "/:addressId",
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
