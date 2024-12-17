// src/utils/logger.ts
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors } = format;

// Definicja formatu logów
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Tworzenie loggera
const logger = createLogger({
  level: "info", // Ustawienie poziomu logowania
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Obsługa błędów z tracebackiem
    myFormat
  ),
  transports: [
    new transports.Console(), // Logowanie do konsoli
    new transports.File({ filename: "logs/error.log", level: "error" }), // Logowanie błędów do pliku
    new transports.File({ filename: "logs/combined.log" }), // Logowanie wszystkich logów do pliku
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
});

export default logger;
