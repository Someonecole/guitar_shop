import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";

const app = createApp({ authRoutes, productRoutes, orderRoutes, stripeRoutes });

const port = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`API running on :${port}`)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });