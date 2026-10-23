const mongoose = require("mongoose");

const reviewHelpfulVoteSchema = new mongoose.Schema(
  {
    // The review being voted on
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },

    // The user who voted
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },

    // Whether the vote is helpful (true) or not helpful (false)
    isHelpful: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one vote per user per review
reviewHelpfulVoteSchema.index({ review: 1, user: 1 }, { unique: true });

// Index for performance
reviewHelpfulVoteSchema.index({ user: 1, createdAt: -1 });
reviewHelpfulVoteSchema.index({ review: 1, isHelpful: 1 });

module.exports = mongoose.model("ReviewHelpfulVote", reviewHelpfulVoteSchema);
