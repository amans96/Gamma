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

const measureUpload = (uploadMiddleware, uploadType) => {
  return (req, res, next) => {
    const startedAt = Date.now();

    console.log(`[${uploadType}] Upload started`);

    uploadMiddleware(req, res, (error) => {
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(2);

      if (error) {
        console.error(
          `[${uploadType}] Failed after ${seconds}s:`,
          error.message
        );
        return next(error);
      }

      console.log(
        `[${uploadType}] Middleware completed in ${seconds}s`
      );

      console.log(`[${uploadType}] File size:`, req.file?.size);
      console.log(`[${uploadType}] Cloudinary URL:`, req.file?.path);

      next();
    });
  };
};


// ==========================================
// UPLOAD PRODUCT ROUTE
// ==========================================
router.post(
  "/product",
  protect,
  adminOnly,
measureUpload(uploadProduct.single("image"), "PRODUCT"),
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