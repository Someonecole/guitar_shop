import { jest } from "@jest/globals";import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import { createApp } from "../src/app.js";
import authRoutes from "../src/routes/auth.routes.js";
import productRoutes from "../src/routes/product.routes.js";
import orderRoutes from "../src/routes/order.routes.js";
import { connectTestDB, disconnectTestDB, clearDB } from "./setupDb.js";
import User from "../src/models/User.js";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const stripeRoutes = express.Router();
const app = createApp({ authRoutes, productRoutes, orderRoutes, stripeRoutes });

jest.setTimeout(30000);

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearDB();
});

async function makeAdminAndToken() {
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@gmail.com",
    password: "123456"
  });

  await User.updateOne({ email: "admin@gmail.com" }, { role: "admin" });

  const login = await request(app).post("/api/auth/login").send({
    email: "admin@gmail.com",
    password: "123456"
  });

  return login.body.token;
}

test("GET /api/products -> empty array", async () => {
  const res = await request(app).get("/api/products");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.products)).toBe(true);
  expect(res.body.products.length).toBe(0);
});

test("Admin can create product", async () => {
  const token = await makeAdminAndToken();

  const res = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Ibanez RG550",
      slug: "ibanez-rg550",
      category: "guitar",
      brand: "Ibanez",
      price: 999,
      stock: 2,
      description: "Test",
      images: [],
      specs: { body: "Basswood", neck: "Maple", pickups: "HSH", color: "Purple" }
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.product.slug).toBe("ibanez-rg550");

  const list = await request(app).get("/api/products");
  expect(list.body.products.length).toBe(1);
});