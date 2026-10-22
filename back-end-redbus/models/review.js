const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Review author
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },

    // Associated booking (one review per booking)
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
      required: true,
    },

    // Associated bus
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buses",
      required: true,
    },

    // Associated route
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routes",
      required: true,
    },

    // Rating (1-5 stars)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer between 1 and 5",
      },
    },

    // Review text
    reviewText: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 500,
    },

    // Review status
    status: {
      type: String,
      enum: ["VISIBLE", "HIDDEN", "REMOVED"],
      default: "VISIBLE",
    },

    // Helpful vote count
    helpfulCount: {
      type: Number,
      default: 0,
    },

    // Report count
    reportCount: {
      type: Number,
      default: 0,
    },

    // Edit deadline (24 hours after creation)
    editDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },

    // Whether review has been edited
    isEdited: {
      type: Boolean,
      default: false,
    },

    // Moderation notes
    adminNote: {
      type: String,
      default: "",
    },

    // Original review text (for tracking edits)
    originalReviewText: {
      type: String,
      default: "",
    },

    // Original rating (for tracking edits)
    originalRating: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one review per user per booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

// Indexes for performance
reviewSchema.index({ bus: 1, status: 1 });
reviewSchema.index({ route: 1, status: 1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ helpfulCount: -1 });
reviewSchema.index({ createdAt: -1 });

// Pre-save middleware to set edit deadline
reviewSchema.pre("save", function (next) {
  if (this.isNew) {
    // Set edit deadline to 24 hours from creation
    this.editDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

// Method to check if review is editable
reviewSchema.methods.isEditable = function () {
  return new Date() < this.editDeadline;
};

// Static method to calculate average rating for a route
reviewSchema.statics.calculateAverageRating = async function (routeId) {
  const result = await this.aggregate([
    {
      $match: {
        route: mongoose.Types.ObjectId(routeId),
        status: "VISIBLE",
      },
    },
    {
      $group: {
        _id: "$route",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  return {
    averageRating: parseFloat(result[0].averageRating.toFixed(1)),
    totalReviews: result[0].totalReviews,
  };
};

module.exports = mongoose.model("Review", reviewSchema);
