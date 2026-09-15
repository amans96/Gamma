import express from "express";

import {
  uploadProductImage,
  uploadPartnerImage,
  uploadBlogImage // (Optional: If you use it)
} from "../controllers/imageUploadController.js";

import {
  uploadProduct,
  uploadPartner,
  uploadBlog // (Optional: If you use it)
} from "../middleware/uploadMiddleware.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// UPLOAD PRODUCT ROUTE
// ==========================================
router.post(
  "/product",
  protect,
  adminOnly,
  uploadProduct.single("image"),
  uploadProductImage
);

// ==========================================
// UPLOAD PARTNER ROUTE
// ==========================================
router.post(
  "/partner",
  protect,
  adminOnly,
  (req, res, next) => {
    console.log("===== PARTNER UPLOAD ROUTE REACHED =====");
    next();
  },
  uploadPartner.single("image"),
  (req, res, next) => {
    console.log("===== MULTER FINISHED =====");
    console.log("REQ.FILE:", req.file);
    next();
  },
  uploadPartnerImage
);

// ==========================================
// UPLOAD BLOG ROUTE (Optional)
// ==========================================
router.post(
  "/blog",
  protect,
  adminOnly,
  uploadBlog.single("image"),
  uploadBlogImage
);

export default router;