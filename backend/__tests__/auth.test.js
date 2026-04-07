import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import { createApp } from "../src/app.js";
import authRoutes from "../src/routes/auth.routes.js";
import productRoutes from "../src/routes/product.routes.js";
import orderRoutes from "../src/routes/order.routes.js";
import { connectTestDB, disconnectTestDB, clearDB } from "./setupDb.js";

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

test("register -> returns token and user", async () => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@gmail.com",
    password: "123456"
  });

  expect(res.statusCode).toBe(200);
  expect(typeof res.body.token).toBe("string");
  expect(res.body.token.length).toBeGreaterThan(10);

  expect(res.body.user).toBeTruthy();
  expect(res.body.user.email).toBe("admin@gmail.com");
  expect(res.body.user.name).toBe("Admin");
  expect(res.body.user.role).toBe("user");
});

test("register duplicate email -> 409", async () => {
  await request(app).post("/api/auth/register").send({
    name: "User1",
    email: "dup@gmail.com",
    password: "123456"
  });

  const res = await request(app).post("/api/auth/register").send({
    name: "User2",
    email: "dup@gmail.com",
    password: "123456"
  });

  expect(res.statusCode).toBe(409);
  expect(res.body.message).toBeTruthy();
});

test("login -> returns token", async () => {
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "u@u.com",
    password: "123456"
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "u@u.com",
    password: "123456"
  });

  expect(res.statusCode).toBe(200);
  expect(typeof res.body.token).toBe("string");
  expect(res.body.token.length).toBeGreaterThan(10);
  expect(res.body.user.email).toBe("u@u.com");
});

test("login wrong password -> 401", async () => {
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "u2@u.com",
    password: "123456"
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "u2@u.com",
    password: "wrong"
  });

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBeTruthy();
});

test("me endpoint -> returns current user when authorized", async () => {
  const reg = await request(app).post("/api/auth/register").send({
    name: "Me",
    email: "me@me.com",
    password: "123456"
  });

  const token = reg.body.token;

  const me = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  expect(me.statusCode).toBe(200);
  expect(me.body.user.email).toBe("me@me.com");
  expect(me.body.user.name).toBe("Me");
  expect(me.body.user.role).toBe("user");
});

test("me endpoint -> 401 without token", async () => {
  const me = await request(app).get("/api/auth/me");
  expect(me.statusCode).toBe(401);
});