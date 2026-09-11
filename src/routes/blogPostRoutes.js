
import express from "express";

import {
  createBlogPost,
  getBlogPosts,
  getPublishedBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogPostController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC WEBSITE
// ==========================================

// Get published blog posts
router.get("/public", getPublishedBlogPosts);

// Get single blog post
router.get("/:id", getBlogPostById);


// ==========================================
// ADMIN
// ==========================================

// Get all blog posts
router.get(
  "/",
  protect,
  adminOnly,
  getBlogPosts
);

// Create blog post
router.post(
  "/",
  protect,
  adminOnly,
  createBlogPost
);

// Update blog post
router.put(
  "/:id",
  protect,
  adminOnly,
  updateBlogPost
);

// Delete blog post
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBlogPost
);


export default router;

