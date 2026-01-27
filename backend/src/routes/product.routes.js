import express from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import Product from "../models/Product.js";
import { authRequired, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q = "", category = "" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [{ title: { $regex: q, $options: "i" } }, { brand: { $regex: q, $options: "i" } }];

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ products });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const p = await Product.findOne({ slug: req.params.slug }).lean();
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ product: p });
  })
);

const productSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(["guitar", "part", "accessory"]),
  brand: z.string().optional().default(""),
  price: z.number().min(0),
  stock: z.number().min(0),
  description: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  specs: z
    .object({
      body: z.string().optional().default(""),
      neck: z.string().optional().default(""),
      pickups: z.string().optional().default(""),
      color: z.string().optional().default("")
    })
    .optional()
    .default({})
});

router.post(
  "/",
  authRequired,
  adminOnly,
  asyncHandler(async (req, res) => {
    const data = productSchema.parse(req.body);
    const exists = await Product.findOne({ slug: data.slug });
    if (exists) return res.status(409).json({ message: "Slug already exists" });

    const product = await Product.create(data);
    res.status(201).json({ product });
  })
);

router.put(
  "/:id",
  authRequired,
  adminOnly,
  asyncHandler(async (req, res) => {
    const data = productSchema.partial().parse(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  })
);

router.delete(
  "/:id",
  authRequired,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ ok: true });
  })
);

export default router;
