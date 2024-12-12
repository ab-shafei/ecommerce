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
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleare";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authenticateJWT, authorizeRoles("ADMIN"), createProduct);
router.post(
  "/:id/upload",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  uploadMultipleImages([{ name: "files" }]),
  uploadProductImages
);
router.put("/:id", authenticateJWT, authorizeRoles("ADMIN"), updateProduct);
router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteProduct);

export default router;
