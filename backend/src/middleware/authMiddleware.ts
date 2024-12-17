// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import prisma from "../utils/prisma";

type Role = "USER" | "ADMIN" | "MODERATOR";

// Middleware do uwierzytelniania
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Brak tokenu uwierzytelniającego." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Sprawdzenie, czy użytkownik istnieje
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: "Użytkownik nie istnieje." });
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ message: "Nieprawidłowy token uwierzytelniający." });
  }
};

// Middleware do autoryzacji na podstawie ról
export const authorize = (roles: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Brak dostępu." });
    }

    if (typeof roles === "string") {
      if (req.user.role !== roles) {
        return res.status(403).json({ message: "Dostęp zabroniony." });
      }
    } else {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Dostęp zabroniony." });
      }
    }

    next();
  };
};
