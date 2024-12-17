// src/routes/userRoutes.ts
import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

// Protected Routes (tylko ADMIN może uzyskać listę użytkowników)
router.get("/", authenticate, authorize("ADMIN"), getAllUsers);
router.get("/:id", authenticate, authorize(["ADMIN", "USER"]), getUserById);
router.put("/:id", authenticate, authorize(["ADMIN", "USER"]), updateUser);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteUser);

export default router;
