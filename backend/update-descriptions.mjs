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
    slug: String,
    description: String
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

async function main() {
  const filePath = path.join(__dirname, "products-bg.json");
  const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

  await mongoose.connect(process.env.MONGO_URI);

  let updated = 0;
  for (const it of items) {
    if (!it.slug || typeof it.description !== "string") continue;
    const res = await Product.updateOne(
      { slug: it.slug },
      { $set: { description: it.description } }
    );
    if (res.modifiedCount > 0) updated += 1;
  }

  console.log("Updated:", updated);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});