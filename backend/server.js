
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to ShopEase E-commerce Backend!");
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ShopEase backend running at http://localhost:${PORT}`);
});
