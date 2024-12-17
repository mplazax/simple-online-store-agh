// src/controllers/productController.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import prisma from "../utils/prisma";

// GET /api/products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    logger.error("Error fetching products:", error);
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Produkt nie został znaleziony." });
    }
    res.status(200).json(product);
  } catch (error) {
    logger.error(`Error fetching product with id ${id}:`, error);
    next(error);
  }
};

// POST /api/products
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, price, category, quantity } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: { name, description, price, category, quantity },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error("Error creating product:", error);
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, price, category, quantity } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, price, category, quantity },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    logger.error(`Error updating product with id ${id}:`, error);
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting product with id ${id}:`, error);
    next(error);
  }
};
