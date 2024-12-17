// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";
import logger from "../utils/logger";

// GET /api/users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users:", error);
    next(error);
  }
};

// GET /api/users/:id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony." });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user with id ${id}:`, error);
    next(error);
  }
};

// PUT /api/users/:id
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const updatedData: any = { name, email, role };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user with id ${id}:`, error);
    next(error);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting user with id ${id}:`, error);
    next(error);
  }
};
