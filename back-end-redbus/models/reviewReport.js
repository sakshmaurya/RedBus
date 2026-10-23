const mongoose = require("mongoose");

const reviewReportSchema = new mongoose.Schema(
  {
    // The review being reported
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },

    // The user who reported the review
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },

    // Reason for reporting
    reason: {
      type: String,
      enum: [
        "Spam",
        "Offensive content",
        "Fake review",
        "Harassment",
        "Irrelevant content",
        "Other",
      ],
      required: true,
    },

    // Additional details (optional)
    details: {
      type: String,
      default: "",
    },

    // Report status
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },

    // Admin notes
    adminNote: {
      type: String,
      default: "",
    },

    // Reviewed by (admin)
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      default: null,
    },

    // Reviewed at timestamp
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one report per user per review
reviewReportSchema.index({ review: 1, reportedBy: 1 }, { unique: true });

// Indexes for performance
reviewReportSchema.index({ review: 1, status: 1 });
reviewReportSchema.index({ reportedBy: 1, createdAt: -1 });
reviewReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("ReviewReport", reviewReportSchema);
