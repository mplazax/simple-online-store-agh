// src/routes/orderRoutes.ts
import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Protected Routes
router.get("/", authenticate, getAllOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/", authenticate, createOrder);
router.put("/:id/status", authenticate, updateOrderStatus);
router.delete("/:id", authenticate, deleteOrder);

export default router;
