// src/__tests__/userController.test.ts
import request from "supertest";
import app from "../app"; // Upewnij się, że masz plik app.ts eksportujący Express app
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

describe("User Controller Endpoints", () => {
  let adminToken: string;
  let userToken: string;
  let adminId: number;
  let userId: number;

  beforeAll(async () => {
    // Stwórz testowego administratora
    const hashedPassword = await bcrypt.hash("adminpass", 10);
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    adminId = admin.id;

    // Stwórz token JWT dla administratora
    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Stwórz testowego użytkownika
    const userPassword = await bcrypt.hash("userpass", 10);
    const user = await prisma.user.create({
      data: {
        name: "Regular User",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
      },
    });
    userId = user.id;

    // Stwórz token JWT dla użytkownika
    userToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  });

  afterAll(async () => {
    // Usuń testowych użytkowników
    await prisma.user.deleteMany({
      where: {
        email: { in: ["admin@example.com", "user@example.com"] },
      },
    });
    await prisma.$disconnect();
  });

  it("should allow admin to get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should deny regular user to get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message", "Dostęp zabroniony.");
  });

  it("should allow admin to get a user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  it("should allow admin to update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated User",
        email: "updateduser@example.com",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Updated User");
    expect(res.body).toHaveProperty("email", "updateduser@example.com");
  });

  it("should allow admin to delete a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(204);
  });
});
