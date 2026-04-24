import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../src/config/db.js";
import { notFound, errorHandler } from "../src/middleware/error.js";

import authRoutes from "../src/routes/auth.routes.js";
import productRoutes from "../src/routes/product.routes.js";
import orderRoutes from "../src/routes/order.routes.js";
import stripeRoutes from "../src/routes/stripe.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// локално: чете backend/.env; на Vercel env var-овете идват от Dashboard
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);

app.use(notFound);
app.use(errorHandler);

// IMPORTANT: serverless – не слушаме app.listen()
// Вместо това export-ваме handler:

let dbReady = false;

export default async function handler(req, res) {
  if (!dbReady) {
    await connectDB(process.env.MONGO_URI);
    dbReady = true;
  }
  return app(req, res);
}