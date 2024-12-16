import { Router } from "express";
import {
  getWebsiteLayout,
  changeWebsiteLayout,
  changeImagesOFWebsiteLayout,
} from "../controllers/layoutController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleware";

const router = Router();

router.get("/", getWebsiteLayout);

router.post("/", authenticateJWT, authorizeRoles("ADMIN"), changeWebsiteLayout);

router.post(
  "/images",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "files" }]),
  changeImagesOFWebsiteLayout
);

export default router;
