
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Order from "../models/order.js";
import Product from "../models/product.js";

const router = express.Router();

// Verify login token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. Please login." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Place a new order
router.post("/", verifyToken, async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order items are required." });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const quantity = Number(item.quantity);

            if (!item.product || !mongoose.isValidObjectId(item.product) ||
                !Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ message: "Invalid product or quantity." });
            }

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}.`,
                });
            }

            totalAmount += product.price * quantity;

            orderItems.push({
                product: product._id,
                quantity,
            });
        }

        const order = await Order.create({
            user: req.userId,
            items: orderItems,
            totalAmount,
        });

        // Reduce stock after order creation
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        res.status(201).json({
            message: "Order placed successfully.",
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get logged-in user's orders
router.get("/my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
