import { Router } from "express";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "../controllers/productController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { uploadProductImages } from "../services/productService";

const router = Router();

router.get("/", authenticateJWT, getAllProducts);
router.get("/:id", authenticateJWT, getProductById);
router.post("/", authenticateJWT, uploadProductImages, createProduct);
router.put("/:id", authenticateJWT, uploadProductImages, updateProduct);
router.delete("/:id", authenticateJWT, deleteProduct);

export default router;
