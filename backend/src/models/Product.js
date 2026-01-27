import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, enum: ["guitar", "part", "accessory"], required: true },
    brand: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },
    images: [{ type: String }],
    specs: {
      body: { type: String, default: "" },
      neck: { type: String, default: "" },
      pickups: { type: String, default: "" },
      color: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
