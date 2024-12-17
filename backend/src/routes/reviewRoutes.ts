// src/routes/reviewRoutes.ts
import { Router } from "express";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public Route
router.get("/product/:productId", getReviewsByProduct);

// Protected Routes
router.post("/", authenticate, createReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;
