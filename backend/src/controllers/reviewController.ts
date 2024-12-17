// src/controllers/reviewController.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import logger from "../utils/logger";

// GET /api/reviews/product/:productId
export const getReviewsByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: Number(productId) },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    logger.error(`Error fetching reviews for product ${productId}:`, error);
    next(error);
  }
};

// POST /api/reviews
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { productId, rating, comment } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  if (!productId || !rating || !comment) {
    return res
      .status(400)
      .json({ message: "productId, rating i comment są wymagane." });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        userId,
        productId: Number(productId),
        rating: Number(rating),
        comment,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        product: true,
      },
    });
    res.status(201).json(newReview);
  } catch (error) {
    logger.error(
      `Error creating review for product ${productId} by user ${userId}:`,
      error
    );
    next(error);
  }
};

// PUT /api/reviews/:id
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  if (!rating || !comment) {
    return res.status(400).json({ message: "rating i comment są wymagane." });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
    });

    if (!review || review.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona." });
    }

    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: { rating: Number(rating), comment },
      include: {
        user: {
          select: { id: true, name: true },
        },
        product: true,
      },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    logger.error(`Error updating review ${id} by user ${userId}:`, error);
    next(error);
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
    });

    if (!review || review.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona." });
    }

    await prisma.review.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting review ${id} by user ${userId}:`, error);
    next(error);
  }
};
