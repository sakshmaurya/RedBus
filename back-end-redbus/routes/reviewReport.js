const express = require("express");
const router = express.Router();
const reviewReportController = require("../controllers/reviewReportController");
const { protect, requireAdmin } = require("../middleware/auth");

// Create Review Report
router.post("/v1/api/review-reports", protect, reviewReportController.createReviewReport);

// Get All Review Reports (Admin)
router.get("/v1/api/review-reports", protect, requireAdmin, reviewReportController.getAllReviewReports);

// Update Review Status (Admin)
router.put("/v1/api/reviews/:reviewId/status", protect, requireAdmin, reviewReportController.updateReviewStatus);

// Update Review Report Status (Admin)
router.put("/v1/api/review-reports/:reportId/status", protect, requireAdmin, reviewReportController.updateReviewReportStatus);

// Get Review Statistics (Admin)
router.get("/v1/api/review-reports/stats", protect, requireAdmin, reviewReportController.getReviewStats);

module.exports = router;
