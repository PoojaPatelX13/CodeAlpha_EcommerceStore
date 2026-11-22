
import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new product
router.post("/", async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json({
            message: "Product added successfully",
            product: savedProduct,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update only a product's image
router.patch("/:id/image", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { image: req.body.image },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product image updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
