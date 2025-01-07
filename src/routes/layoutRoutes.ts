import { Router } from "express";
import {
  getWebsiteLayout,
  changeWebsiteLayout,
  addBannerImageToLayout,
  deleteBannerImageFromLayout,
} from "../controllers/layoutController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleware";
import { changeLayoutValidation } from "../validations/layoutValidation";

const router = Router();

router.get("/", getWebsiteLayout);

router.post(
  "/",
  changeLayoutValidation,
  authenticateJWT,
  authorizeRoles("ADMIN"),
  changeWebsiteLayout
);

router.post(
  "/images",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "files" }]),
  addBannerImageToLayout
);

router.delete(
  "/images/:id",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  deleteBannerImageFromLayout
);

export default router;
