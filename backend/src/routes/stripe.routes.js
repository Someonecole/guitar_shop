import express from "express";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import { z } from "zod";
import Order from "../models/Order.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const schema = z.object({
  orderId: z.string().min(1)
});

router.post(
  "/create-checkout-session",
  authRequired,
  asyncHandler(async (req, res) => {
    const stripe = getStripe();

    const { orderId } = schema.parse(req.body);

    const order = await Order.findOne({ _id: orderId, userId: req.user.sub });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: order.items.map((it) => ({
        price_data: {
          currency: "eur",
          product_data: { name: it.title },
          unit_amount: Math.round(it.price * 100)
        },
        quantity: it.qty
      })),
      success_url: `${process.env.CLIENT_ORIGIN}/checkout/success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/checkout/cancel?orderId=${order._id}`
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  })
);

export default router;