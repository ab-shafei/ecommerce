import { Router } from "express";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "../controllers/productController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleare";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "images" }]),
  createProduct
);
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "images" }]),
  updateProduct
);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteProduct);

export default router;
