// src/routes/authRoutes.ts
import { Router } from "express";
import { register, login, refreshToken } from "../controllers/authController";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

export default router;
