import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.js";

dotenv.config();

const products = [
  // ELECTRONICS
  {
    name: "Wireless Headphones",
    description: "Over-ear wireless headphones with premium sound.",
    price: 1999, category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    stock: 25
  },
  {
    name: "Smartphone",
    description: "Modern smartphone for everyday communication and entertainment.",
    price: 14999, category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    stock: 20
  },
  {
    name: "Smart Watch",
    description: "Smart watch for fitness tracking and daily activities.",
    price: 2499, category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    stock: 30
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker for music and entertainment.",
    price: 1799, category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    stock: 25
  },
  {
    name: "Laptop",
    description: "Slim laptop for study, office work and entertainment.",
    price: 45999, category: "Electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    stock: 10
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse for computer users.",
    price: 799, category: "Electronics",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    stock: 40
  },
  {
    name: "Digital Camera",
    description: "Digital camera for capturing photographs and memories.",
    price: 24999, category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    stock: 12
  },
  {
    name: "Gaming Controller",
    description: "Game controller for an enjoyable gaming experience.",
    price: 2499, category: "Electronics",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600",
    stock: 18
  },
  {
    name: "Mechanical Keyboard",
    description: "Mechanical keyboard for comfortable typing.",
    price: 2999, category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    stock: 22
  },
  {
    name: "Tablet",
    description: "Portable tablet for reading and browsing.",
    price: 18999, category: "Electronics",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    stock: 15
  },

  // FASHION
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for exercise and daily use.",
    price: 2499, category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 25
  },
  {
    name: "Casual Backpack",
    description: "Spacious backpack for college, office and travel.",
    price: 1299, category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    stock: 30
  },
  {
    name: "Leather Handbag",
    description: "Stylish handbag with useful storage space.",
    price: 2999, category: "Fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
    stock: 15
  },
  {
    name: "Sunglasses",
    description: "Classic sunglasses with a stylish frame.",
    price: 999, category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
    stock: 40
  },
  {
    name: "Classic Wrist Watch",
    description: "Elegant wrist watch with a timeless design.",
    price: 1899, category: "Fashion",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",
    stock: 20
  },
  {
    name: "Denim Jacket",
    description: "Casual denim jacket for everyday fashion.",
    price: 2199, category: "Fashion",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600",
    stock: 18
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable cotton T-shirt for daily wear.",
    price: 599, category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    stock: 50
  },
  {
    name: "Leather Wallet",
    description: "Compact wallet with a practical design.",
    price: 899, category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
    stock: 25
  },
  {
    name: "Baseball Cap",
    description: "Casual cap for outdoor activities and daily styling.",
    price: 499, category: "Fashion",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
    stock: 35
  },
  {
    name: "Sports Sneakers",
    description: "Comfortable sneakers for casual outfits and activities.",
    price: 1999, category: "Fashion",
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600",
    stock: 20
  },

  // HOME
  {
    name: "Table Lamp",
    description: "Modern table lamp for bedroom and study spaces.",
    price: 1499, category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    stock: 20
  },
  {
    name: "Indoor Plant",
    description: "Decorative indoor plant for your living space.",
    price: 499, category: "Home",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
    stock: 35
  },
  {
    name: "Wall Clock",
    description: "Modern wall clock for your home.",
    price: 899, category: "Home",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600",
    stock: 20
  },
  {
    name: "Cushion Set",
    description: "Decorative cushions for your sofa and living room.",
    price: 799, category: "Home",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600",
    stock: 25
  },
  {
    name: "Accent Chair",
    description: "Modern accent chair for comfortable seating.",
    price: 5999, category: "Home",
    image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=600",
    stock: 8
  },
  {
    name: "Decorative Vase",
    description: "Decorative vase for flowers and home styling.",
    price: 699, category: "Home",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600",
    stock: 15
  },
  {
    name: "Area Rug",
    description: "Decorative floor rug for your living room.",
    price: 2499, category: "Home",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600",
    stock: 12
  },
  {
    name: "Bedsheet Set",
    description: "Comfortable bedsheet set for your bedroom.",
    price: 1299, category: "Home",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
    stock: 20
  },
  {
    name: "Wall Mirror",
    description: "Decorative mirror for bedroom and living room interiors.",
    price: 1799, category: "Home",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600",
    stock: 10
  },
  {
    name: "Storage Basket",
    description: "Practical basket for organising household items.",
    price: 599, category: "Home",
    image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?w=600",
    stock: 30
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingCount = await Product.countDocuments();

    if (existingCount !== 0) {
      throw new Error(
        `Products collection is not empty. Found ${existingCount}. Nothing inserted.`
      );
    }

    if (products.length !== 30) {
      throw new Error(`Expected 30 products, found ${products.length}`);
    }

    const imageUrls = products.map(product => product.image);
    if (new Set(imageUrls).size !== 30) {
      throw new Error("Duplicate image URLs found.");
    }

    await Product.insertMany(products);

    console.log("30 products added successfully!");
    console.log("Electronics: 10");
    console.log("Fashion: 10");
    console.log("Home: 10");
    console.log("Total: 30");
  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

seedProducts();
