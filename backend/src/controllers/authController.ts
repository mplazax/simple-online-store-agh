// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import prisma from "../utils/prisma";

const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// POST /api/auth/register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    // Sprawdzenie czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Użytkownik z tym adresem email już istnieje." });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    logger.info(`User registered with email: ${email}`);

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    logger.error("Error registering user:", error);
    next(error);
  }
};

// POST /api/auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    // Znalezienie użytkownika
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy email lub hasło." });
    }

    // Sprawdzenie hasła
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy email lub hasło." });
    }

    // Generowanie tokenów
    const tokens = generateTokens(user);

    logger.info(`User logged in with email: ${email}`);

    res.status(200).json(tokens);
  } catch (error) {
    logger.error("Error during login:", error);
    next(error);
  }
};

// POST /api/auth/refresh-token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET as string
    ) as any;

    // Znalezienie użytkownika
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(400).json({ message: "Invalid refresh token." });
    }

    // Generowanie nowych tokenów
    const tokens = generateTokens(user);

    res.status(200).json(tokens);
  } catch (error) {
    logger.error("Error refreshing token:", error);
    res.status(401).json({ message: "Invalid refresh token." });
  }
};
