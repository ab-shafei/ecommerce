import { Router } from "express";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImages,
} from "../controllers/productController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleware";
import {
  createProductValidation,
  deleteProductValidation,
  updateProductValidation,
} from "../validations/productValidation";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  createProductValidation,
  authenticateJWT,
  authorizeRoles("ADMIN"),
  createProduct
);
router.post(
  "/:id/upload",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "files" }]),
  uploadProductImages
);
router.put(
  "/:id",
  updateProductValidation,
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateProduct
);
router.delete(
  "/:id",
  deleteProductValidation,
  authenticateJWT,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default router;
