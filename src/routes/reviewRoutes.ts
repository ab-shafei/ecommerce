import { Router } from "express";
import {
  getProductReviews,
  addProductReview,
  moderateProductReview,
} from "../controllers/reviewController";
import {
  addReviewValidation,
  updateReviewValidation,
} from "../validations/reviewValidation";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getProductReviews);
router.post(
  "/",
  addReviewValidation,
  authenticateJWT,
  authorizeRoles("CUSTOMER"),
  addProductReview
);
router.put(
  "/moderate",
  addReviewValidation,
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateReviewValidation,
  moderateProductReview
);

export default router;
