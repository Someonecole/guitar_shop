import express from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authRequired, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      qty: z.number().int().min(1)
    })
  ),
  shipping: z
    .object({
      name: z.string().optional().default(""),
      address: z.string().optional().default(""),
      city: z.string().optional().default(""),
      phone: z.string().optional().default("")
    })
    .optional()
    .default({})
});

router.post(
  "/",
  authRequired,
  asyncHandler(async (req, res) => {
    const { items, shipping } = createOrderSchema.parse(req.body);

    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const map = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = items.map((i) => {
      const p = map.get(i.productId);
      if (!p) throw new Error("Invalid product in cart");
      return {
        productId: p._id,
        title: p.title,
        price: p.price,
        qty: i.qty,
        image: p.images?.[0] || ""
      };
    });

    const subtotal = orderItems.reduce((s, it) => s + it.price * it.qty, 0);

    const order = await Order.create({
      userId: req.user.sub,
      items: orderItems,
      subtotal,
      status: "pending",
      shipping
    });

    res.status(201).json({ order });
  })
);

router.get(
  "/my",
  authRequired,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user.sub }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  })
);

router.get(
  "/admin",
  authRequired,
  adminOnly,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  })
);

router.patch(
  "/admin/:id/status",
  authRequired,
  adminOnly,
  asyncHandler(async (req, res) => {
    const schema = z.object({ status: z.enum(["pending", "paid", "cancelled"]) });
    const { status } = schema.parse(req.body);
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  })
);

export default router;
