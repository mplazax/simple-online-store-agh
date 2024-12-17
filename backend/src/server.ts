// src/server.ts
import app from "./app";
import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    logger.info("Connecting to the database...");
    await prisma.$connect();
    logger.info("Database connected successfully.");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
