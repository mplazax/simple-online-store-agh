// src/routes/productRoutes.ts
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected Routes
router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
