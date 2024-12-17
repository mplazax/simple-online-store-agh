// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import loggerMiddleware from "./middleware/loggerMiddleware";
import { corsMiddleware, corsLogger } from "./middleware/corsMiddleware";

dotenv.config();

const app = express();

// Middleware
app.use(corsMiddleware); // CORS
app.use(corsLogger); // Logowanie CORS
app.use(express.json());
app.use(loggerMiddleware); // Logowanie żądań

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
