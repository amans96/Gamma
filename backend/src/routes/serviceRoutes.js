
import express from "express";

import {
  createService,
  getServices,
  getActiveServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC WEBSITE
// ==========================================

// Get active services
router.get("/public", getActiveServices);

// Get single service
router.get("/:id", getServiceById);


// ==========================================
// ADMIN
// ==========================================

// Get all services
router.get(
  "/",
  protect,
  adminOnly,
  getServices
);

// Create service
router.post(
  "/",
  protect,
  adminOnly,
  createService
);

// Update service
router.put(
  "/:id",
  protect,
  adminOnly,
  updateService
);

// Delete service
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteService
);


export default router;

