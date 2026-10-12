import express from "express";

import {
  uploadProductImage,
  uploadPartnerImage,
  uploadBlogImage,
  getStoredImage,
} from "../controllers/imageUploadController.js";

import {
  uploadProduct,
  uploadPartner,
  uploadBlog,
} from "../middleware/uploadMiddleware.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public image retrieval.
router.get("/:id", getStoredImage);

// Admin image uploads.
router.post(
  "/product",
  protect,
  adminOnly,
  uploadProduct.single("image"),
  uploadProductImage
);

router.post(
  "/partner",
  protect,
  adminOnly,
  uploadPartner.single("image"),
  uploadPartnerImage
);

router.post(
  "/blog",
  protect,
  adminOnly,
  uploadBlog.single("image"),
  uploadBlogImage
);

export default router;