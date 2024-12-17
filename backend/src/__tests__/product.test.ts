// src/__tests__/product.test.ts
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";

let accessToken: string;

beforeAll(async () => {
  // Resetowanie stanu bazy danych przed testami
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Tworzenie testowego użytkownika
  const user = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpass", 10),
      role: "ADMIN",
    },
  });

  // Generowanie tokenu JWT dla testów
  accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
});

afterAll(async () => {
  // Zamknięcie połączenia z bazą danych po testach
  await prisma.$disconnect();
});

describe("Product Endpoints", () => {
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: 99.99,
        category: "Test Category",
        quantity: 10,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "Test Product");
  });

  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fetch a product by ID", async () => {
    const product = await prisma.product.findFirst();
    const res = await request(app).get(`/api/products/${product?.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", product?.id);
  });
});
