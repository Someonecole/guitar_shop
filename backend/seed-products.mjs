import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const productSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    category: String,
    brand: String,
    price: Number,
    stock: Number,
    description: String,
    images: [String],
    specs: {
      body: String,
      neck: String,
      pickups: String,
      color: String
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

async function main() {
  const filePath = path.join(__dirname, "products.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const products = JSON.parse(raw);

  await mongoose.connect(process.env.MONGO_URI);

  // insert only missing by slug
  for (const p of products) {
    const exists = await Product.findOne({ slug: p.slug }).lean();
    if (!exists) await Product.create(p);
  }

  console.log("Seed done");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});