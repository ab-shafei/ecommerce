import { Router } from "express";
import {
  deleteCategory,
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../controllers/categoryController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleare";

const router = Router();

router.get("/", authenticateJWT, getAllCategorys);
router.get("/:id", authenticateJWT, getCategoryById);
router.post(
  "/",
  authenticateJWT,
  uploadMultipleImages([{ name: "images" }]),
  createCategory
);
router.put(
  "/:id",
  authenticateJWT,
  uploadMultipleImages([{ name: "images" }]),
  updateCategory
);
router.delete("/:id", authenticateJWT, deleteCategory);

export default router;
