import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(async () => {
    const { createApp } = await import("./app.js");
    const authRoutes = (await import("./routes/auth.routes.js")).default;
    const productRoutes = (await import("./routes/product.routes.js")).default;
    const orderRoutes = (await import("./routes/order.routes.js")).default;
    const stripeRoutes = (await import("./routes/stripe.routes.js")).default;

    const app = createApp({ authRoutes, productRoutes, orderRoutes, stripeRoutes });
    app.listen(port, () => console.log(`API running on :${port}`));
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });