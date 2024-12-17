// src/routes/cartRoutes.ts
import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Protected Routes
router.get("/", authenticate, getCart);
router.post("/", authenticate, addToCart);
router.put("/:itemId", authenticate, updateCartItem);
router.delete("/:itemId", authenticate, removeFromCart);

export default router;
