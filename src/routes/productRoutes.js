import express from "express";

import {
  createProduct,
  getProducts,
  getActiveProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC WEBSITE
// ==========================================

// Get only ACTIVE products
router.get("/public", getActiveProducts);

// Get single product
router.get("/:id", getProductById);


// ==========================================
// ADMIN
// ==========================================

// Get all products
router.get("/", protect, adminOnly, getProducts);

// Create product
router.post("/", protect, adminOnly, createProduct);

// Update product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);


export default router;