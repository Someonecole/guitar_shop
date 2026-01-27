import express from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(200)
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body);

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role: "user" });

    const token = signToken({ sub: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ sub: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  })
);

router.get(
  "/me",
  authRequired,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.sub).select("name email role createdAt").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, ...user } });
  })
);

export default router;
