import { Router } from "express";
import {
  deleteCategory,
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  uploadCategoryImages,
} from "../controllers/categoryController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleare";

const router = Router();

router.get("/", getAllCategorys);
router.get("/:id", getCategoryById);
router.post("/", authenticateJWT, authorizeRoles("ADMIN"), createCategory);
router.post(
  "/:id/upload",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "files" }]),
  uploadCategoryImages
);
router.put("/:id", authenticateJWT, authorizeRoles("ADMIN"), updateCategory);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteCategory);

export default router;
