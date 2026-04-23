import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../src/config/db.js";
import { createApp } from "../src/app.js";

import authRoutes from "../src/routes/auth.routes.js";
import productRoutes from "../src/routes/product.routes.js";
import orderRoutes from "../src/routes/order.routes.js";
import stripeRoutes from "../src/routes/stripe.routes.js";

let cached = global._mongooseConn;

async function ensureDb() {
  if (!cached) {
    cached = connectDB(process.env.MONGO_URI);
    global._mongooseConn = cached;
  }
  await cached;
}

const app = createApp({ authRoutes, productRoutes, orderRoutes, stripeRoutes });

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}