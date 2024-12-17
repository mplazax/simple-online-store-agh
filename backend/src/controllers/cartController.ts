// src/controllers/cartController.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import prisma from "../utils/prisma";

// GET /api/cart
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  try {
    // Znajdź koszyk użytkownika
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Jeśli koszyk nie istnieje, utwórz nowy
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    logger.error(`Error fetching cart for user ${userId}:`, error);
    next(error);
  }
};

// POST /api/cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "productId i quantity są wymagane." });
  }

  try {
    // Znajdź koszyk użytkownika
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    // Jeśli koszyk nie istnieje, utwórz nowy
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Dodaj lub zaktualizuj pozycję w koszyku
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: {
          increment: Number(quantity),
        },
      },
      create: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: Number(quantity),
      },
      include: {
        product: true,
      },
    });

    res.status(200).json(cartItem);
  } catch (error) {
    logger.error(
      `Error adding product ${productId} to cart for user ${userId}:`,
      error
    );
    next(error);
  }
};

// PUT /api/cart/:itemId
export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  if (!quantity) {
    return res.status(400).json({ message: "quantity jest wymagane." });
  }

  try {
    // Znajdź pozycję w koszyku
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: Number(itemId) },
    });

    if (!cartItem || cartItem.cartId !== userId) {
      return res
        .status(404)
        .json({ message: "Pozycja w koszyku nie została znaleziona." });
    }

    // Zaktualizuj ilość
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: Number(itemId) },
      data: { quantity: Number(quantity) },
      include: {
        product: true,
      },
    });

    res.status(200).json(updatedCartItem);
  } catch (error) {
    logger.error(
      `Error updating cart item ${itemId} for user ${userId}:`,
      error
    );
    next(error);
  }
};

// DELETE /api/cart/:itemId
export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { itemId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  try {
    // Znajdź pozycję w koszyku
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: Number(itemId) },
    });

    if (!cartItem || cartItem.cartId !== userId) {
      return res
        .status(404)
        .json({ message: "Pozycja w koszyku nie została znaleziona." });
    }

    // Usuń pozycję z koszyka
    await prisma.cartItem.delete({
      where: { id: Number(itemId) },
    });

    res.status(204).send();
  } catch (error) {
    logger.error(
      `Error removing cart item ${itemId} for user ${userId}:`,
      error
    );
    next(error);
  }
};
