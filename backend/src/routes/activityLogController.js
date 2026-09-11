
import express from "express";

import {
  getActivityLogs,
  getMyActivityLogs,
  getActivityLogById,
  getActivityLogsByEntity,
  deleteActivityLog,
} from "../controllers/activityLogController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// ADMIN ACTIVITY HISTORY
// ==========================================

// Get all activity logs
router.get(
  "/",
  protect,
  adminOnly,
  getActivityLogs
);

// Get current admin's activity
router.get(
  "/me",
  protect,
  adminOnly,
  getMyActivityLogs
);

// Get activity logs for a specific entity
// Example: /api/activity-logs/entity/Product
router.get(
  "/entity/:entity",
  protect,
  adminOnly,
  getActivityLogsByEntity
);

// Get one activity log
router.get(
  "/:id",
  protect,
  adminOnly,
  getActivityLogById
);

// Delete activity log
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteActivityLog
);


export default router;

