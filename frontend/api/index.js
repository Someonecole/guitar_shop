import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "../../backend/src/config/db.js";
import { notFound, errorHandler } from "../../backend/src/middleware/error.js";

import authRoutes from "../../backend/src/routes/auth.routes.js";
import productRoutes from "../../backend/src/routes/product.routes.js";
import orderRoutes from "../../backend/src/routes/order.routes.js";
import stripeRoutes from "../../backend/src/routes/stripe.routes.js";

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

let dbReady = false;

export default async function handler(req, res) {
  if (!dbReady) {
    await connectDB(process.env.MONGO_URI);
    dbReady = true;
  }
  return app(req, res);
}