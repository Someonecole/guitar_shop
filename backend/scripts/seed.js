import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import Product from "../src/models/Product.js";
import User from "../src/models/User.js";

dotenv.config();

const sampleProducts = [
  {
    title: "Fender Player Stratocaster",
    slug: "fender-player-stratocaster",
    category: "guitar",
    brand: "Fender",
    price: 1650,
    stock: 5,
    description: "Електрическа китара, универсална за rock/pop.",
    images: [],
    specs: { body: "Alder", neck: "Maple", pickups: "SSS", color: "Sunburst" }
  },
  {
    title: "Gibson Les Paul Standard",
    slug: "gibson-les-paul-standard",
    category: "guitar",
    brand: "Gibson",
    price: 5200,
    stock: 2,
    description: "Класически Les Paul тон и sustain.",
    images: [],
    specs: { body: "Mahogany", neck: "Mahogany", pickups: "HH", color: "Cherry" }
  },
  {
    title: "Seymour Duncan JB (SH-4) Bridge",
    slug: "seymour-duncan-jb-sh4",
    category: "part",
    brand: "Seymour Duncan",
    price: 189,
    stock: 15,
    description: "Хъмбъкър за bridge позиция.",
    images: [],
    specs: { body: "", neck: "", pickups: "H", color: "Black" }
  },
  {
    title: "Gotoh Locking Tuners",
    slug: "gotoh-locking-tuners",
    category: "part",
    brand: "Gotoh",
    price: 129,
    stock: 20,
    description: "Заключващи ключове за стабилен tuning.",
    images: [],
    specs: { body: "", neck: "", pickups: "", color: "Chrome" }
  }
];

async function main() {
  await connectDB(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);

  // create admin user if missing
  const email = "admin@guitarshop.local";
  let admin = await User.findOne({ email });
  if (!admin) {
    const passwordHash = await User.hashPassword("admin123");
    admin = await User.create({ name: "Admin", email, passwordHash, role: "admin" });
  }

  console.log("Seeded products and admin:", admin.email);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
