
import express from "express";

import {
  createPartner,
  getPartners,
  getActivePartners,
  getPartnerById,
  updatePartner,
  deletePartner,
} from "../controllers/partnerController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC WEBSITE
// ==========================================

// Get active partners
router.get("/public", getActivePartners);

// Get single partner
router.get("/:id", getPartnerById);


// ==========================================
// ADMIN
// ==========================================

// Get all partners
router.get(
  "/",
  protect,
  adminOnly,
  getPartners
);

// Create partner
router.post(
  "/",
  protect,
  adminOnly,
  createPartner
);

// Update partner
router.put(
  "/:id",
  protect,
  adminOnly,
  updatePartner
);

// Delete partner
router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePartner
);


export default router;

