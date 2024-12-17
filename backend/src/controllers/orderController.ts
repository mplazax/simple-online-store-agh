// src/controllers/orderController.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import prisma from "../utils/prisma";

// GET /api/orders
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    logger.error(`Error fetching orders for user ${userId}:`, error);
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (
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
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order || order.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Zamówienie nie zostało znalezione." });
    }
    res.status(200).json(order);
  } catch (error) {
    logger.error(`Error fetching order ${id} for user ${userId}:`, error);
    next(error);
  }
};

// POST /api/orders
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { items } = req.body; // Zakładam, że items to tablica obiektów { productId, quantity }

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "items są wymagane i powinny być tablicą." });
  }

  try {
    // Tworzenie zamówienia
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: 0, // Zaktualizujemy później
        status: "PENDING",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Obliczanie całkowitej kwoty zamówienia
    const totalAmount = order.orderItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Aktualizacja zamówienia z całkowitą kwotą
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json(updatedOrder);
  } catch (error) {
    logger.error(`Error creating order for user ${userId}:`, error);
    next(error);
  }
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  if (!status) {
    return res.status(400).json({ message: "status jest wymagany." });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order || order.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Zamówienie nie zostało znalezione." });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    logger.error(
      `Error updating status for order ${id} of user ${userId}:`,
      error
    );
    next(error);
  }
};

// DELETE /api/orders/:id
export const deleteOrder = async (
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
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order || order.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Zamówienie nie zostało znalezione." });
    }

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting order ${id} for user ${userId}:`, error);
    next(error);
  }
};
