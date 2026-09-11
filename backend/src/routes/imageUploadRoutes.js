
import express from "express";

import {
  uploadProductImage,
  uploadPartnerImage,
} from "../controllers/imageUploadController.js";

import {
  uploadProduct,
  uploadPartner,
} from "../middleware/uploadMiddleware.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

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

export default router;

