// src/middleware/corsMiddleware.ts
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Opcje CORS
const corsOptions: cors.CorsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Zastąp swoją domeną frontendową
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Jeśli potrzebujesz obsługi ciasteczek
  optionsSuccessStatus: 200,
};

// Tworzenie middleware CORS
const corsMiddleware = cors(corsOptions);

// Middleware do logowania zapytań CORS
const corsLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`CORS request: ${req.method} ${req.originalUrl}`);
  next();
};

export { corsMiddleware, corsLogger };
