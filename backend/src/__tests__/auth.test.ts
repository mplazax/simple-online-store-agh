// src/__tests__/auth.test.ts
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import prisma from "../utils/prisma";

beforeAll(async () => {
  // Opcjonalnie: Resetowanie stanu bazy danych przed testami
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  // Zamknięcie połączenia z bazą danych po testach
  await prisma.$disconnect();
});

describe("Authentication Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});
