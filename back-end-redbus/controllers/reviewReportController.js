const ReviewReport = require("../models/reviewReport");
const Review = require("../models/review");

// Create Review Report
exports.createReviewReport = async (req, res) => {
  try {
    const { reviewId, reason, details } = req.body;
    const reportedBy = req.user._id;

    // Validate reason
    const validReasons = [
      "Spam",
      "Offensive content",
      "Fake review",
      "Harassment",
      "Irrelevant content",
      "Other",
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report reason",
      });
    }

    // Check if review exists
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if review is already reported by this user
    const existingReport = await ReviewReport.findOne({
      review: reviewId,
      reportedBy,
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this review",
      });
    }

    // Prevent reporting own review
    if (review.user.toString() === reportedBy.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot report your own review",
      });
    }

    // Create report
    const report = await ReviewReport.create({
      review: reviewId,
      reportedBy,
      reason,
      details: details || "",
    });

    // Increment review report count
    review.reportCount += 1;
    await review.save();

    // Auto-hide review if report count exceeds threshold (e.g., 5)
    const REPORT_THRESHOLD = 5;
    if (review.reportCount >= REPORT_THRESHOLD && review.status === "VISIBLE") {
      review.status = "HIDDEN";
      review.adminNote = "Auto-hidden due to excessive reports";
      await review.save();
    }

    res.status(201).json({
      success: true,
      message: "Review reported successfully",
      report,
    });
  } catch (error) {
    console.error("Error creating review report:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create report",
    });
  }
};

// Get All Review Reports (Admin)
exports.getAllReviewReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    const reports = await ReviewReport.find(query)
      .populate("review", "rating reviewText status helpfulCount")
      .populate("reportedBy", "name email")
      .populate("review.user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ReviewReport.countDocuments(query);

    res.json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Review Status (Admin)
exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, adminNote } = req.body;

    const validStatuses = ["VISIBLE", "HIDDEN", "REMOVED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status",
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update review status
    review.status = status;
    if (adminNote) {
      review.adminNote = adminNote;
    }
    await review.save();

    res.json({
      success: true,
      message: "Review status updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Review Report Status (Admin)
exports.updateReviewReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNote } = req.body;

    const validStatuses = ["PENDING", "REVIEWED", "RESOLVED", "REJECTED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await ReviewReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Update report status
    report.status = status;
    if (adminNote) {
      report.adminNote = adminNote;
    }
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    await report.save();

    res.json({
      success: true,
      message: "Report status updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Review Statistics (Admin)
exports.getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const visibleReviews = await Review.countDocuments({ status: "VISIBLE" });
    const hiddenReviews = await Review.countDocuments({ status: "HIDDEN" });
    const removedReviews = await Review.countDocuments({ status: "REMOVED" });
    const pendingReports = await ReviewReport.countDocuments({ status: "PENDING" });

    // Calculate average rating across all visible reviews
    const ratingStats = await Review.aggregate([
      { $match: { status: "VISIBLE" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalHelpfulVotes: { $sum: "$helpfulCount" },
        },
      },
    ]);

    const stats = {
      totalReviews,
      visibleReviews,
      hiddenReviews,
      removedReviews,
      pendingReports,
      averageRating: ratingStats.length > 0 ? ratingStats[0].averageRating.toFixed(1) : 0,
      totalHelpfulVotes: ratingStats.length > 0 ? ratingStats[0].totalHelpfulVotes : 0,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
