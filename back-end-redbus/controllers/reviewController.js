const Review = require("../models/review");
const ReviewHelpfulVote = require("../models/reviewHelpfulVote");
const Booking = require("../models/booking");
const Customer = require("../models/customer");
const Bus = require("../models/bus");
const NotificationService = require("../services/notificationService");

// Constants
const MIN_REVIEW_CHARS = 50;
const MAX_REVIEW_CHARS = 500;
const TRUSTED_REVIEWER_THRESHOLD = 10;

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, busId, routeId, rating, reviewText } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Validate review text length
    if (!reviewText || reviewText.length < MIN_REVIEW_CHARS) {
      return res.status(400).json({
        success: false,
        message: `Review must contain at least ${MIN_REVIEW_CHARS} characters`,
      });
    }

    if (reviewText.length > MAX_REVIEW_CHARS) {
      return res.status(400).json({
        success: false,
        message: `Review cannot exceed ${MAX_REVIEW_CHARS} characters`,
      });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own bookings",
      });
    }

    // Check if journey is completed
    if (booking.journeyStatus !== "COMPLETED") {
      return res.status(403).json({
        success: false,
        message: "You can only review completed journeys",
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({
      user: userId,
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this journey",
      });
    }

    // Verify bus and route exist
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      booking: bookingId,
      bus: busId,
      route: routeId,
      rating,
      reviewText,
      originalReviewText: reviewText,
      originalRating: rating,
    });

    // Update bus rating array
    if (bus.rating && Array.isArray(bus.rating)) {
      while (bus.rating.length < 5) bus.rating.push(0);
      bus.rating[rating - 1] = (bus.rating[rating - 1] || 0) + 1;
      if (typeof bus.markModified === "function") bus.markModified("rating");
    } else {
      bus.rating = [0, 0, 0, 0, 0];
      bus.rating[rating - 1] = 1;
    }
    await bus.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

// Get Reviews by Route
exports.getReviewsByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      route: routeId,
      status: "VISIBLE",
    })
      .populate("user", "name isTrustedReviewer")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      route: routeId,
      status: "VISIBLE",
    });

    res.json({
      success: true,
      reviews,
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

// Get Reviews by User
exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      user: userId,
    })
      .populate("bus", "operatorName busType")
      .populate("route", "departureLocation.name arrivalLocation.name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      reviews,
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

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own reviews",
      });
    }

    // Check if review is still editable (within 24 hours)
    if (!review.isEditable()) {
      return res.status(403).json({
        success: false,
        message: "Review can only be edited within 24 hours of submission",
      });
    }

    // Validate rating if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be an integer between 1 and 5",
        });
      }
    }

    // Validate review text if provided
    if (reviewText !== undefined) {
      if (reviewText.length < MIN_REVIEW_CHARS) {
        return res.status(400).json({
          success: false,
          message: `Review must contain at least ${MIN_REVIEW_CHARS} characters`,
        });
      }

      if (reviewText.length > MAX_REVIEW_CHARS) {
        return res.status(400).json({
          success: false,
          message: `Review cannot exceed ${MAX_REVIEW_CHARS} characters`,
        });
      }
    }

    // Update review
    const updateData = {};
    if (rating !== undefined) {
      updateData.rating = rating;
    }
    if (reviewText !== undefined) {
      updateData.reviewText = reviewText;
    }
    updateData.isEdited = true;

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    // Check if review is still editable (within 24 hours)
    if (!review.isEditable()) {
      return res.status(403).json({
        success: false,
        message: "Review can only be deleted within 24 hours of submission",
      });
    }

    await Review.findByIdAndDelete(id);

    // Update bus rating array
    const bus = await Bus.findById(review.bus);
    if (bus && bus.rating && Array.isArray(bus.rating)) {
      bus.rating[review.rating - 1] = Math.max(0, (bus.rating[review.rating - 1] || 0) - 1);
      await bus.save();
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Route Average Rating
exports.getRouteAverageRating = async (req, res) => {
  try {
    const { routeId } = req.params;

    const ratingData = await Review.calculateAverageRating(routeId);

    res.json({
      success: true,
      ...ratingData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Review as Helpful
exports.markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHelpful } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user already voted
    const existingVote = await ReviewHelpfulVote.findOne({
      review: id,
      user: userId,
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted on this review",
      });
    }

    // Prevent voting on own review
    if (review.user.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot vote on your own review",
      });
    }

    // Create vote
    await ReviewHelpfulVote.create({
      review: id,
      user: userId,
      isHelpful,
    });

    // Update review helpful count
    if (isHelpful) {
      review.helpfulCount += 1;
      
      // Update user's helpful votes received
      await Customer.findByIdAndUpdate(review.user, {
        $inc: { helpfulVotesReceived: 1 },
      });

      // Check if user should become trusted reviewer
      const reviewAuthor = await Customer.findById(review.user);
      if (
        reviewAuthor.helpfulVotesReceived >= TRUSTED_REVIEWER_THRESHOLD &&
        !reviewAuthor.isTrustedReviewer
      ) {
        await Customer.findByIdAndUpdate(review.user, {
          isTrustedReviewer: true,
        });
      }
    }

    await review.save();

    res.json({
      success: true,
      message: isHelpful
        ? "Review marked as helpful"
        : "Review marked as not helpful",
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Helpful Vote
exports.removeHelpfulVote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Find and delete vote
    const vote = await ReviewHelpfulVote.findOne({
      review: id,
      user: userId,
    });

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }

    // Update review helpful count
    if (vote.isHelpful) {
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
      
      // Update user's helpful votes received
      await Customer.findByIdAndUpdate(review.user, {
        $inc: { helpfulVotesReceived: -1 },
      });
    }

    await review.save();
    await ReviewHelpfulVote.deleteOne({ _id: vote._id });

    res.json({
      success: true,
      message: "Vote removed successfully",
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User's Review Eligibility
exports.getReviewEligibility = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check ownership
    if (booking.customerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only check your own bookings",
      });
    }

    // Check if journey is completed
    const isJourneyCompleted = booking.journeyStatus === "COMPLETED";

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: userId,
      booking: bookingId,
    });

    const hasReviewed = !!existingReview;

    res.json({
      success: true,
      eligibility: {
        isJourneyCompleted,
        hasReviewed,
        canReview: isJourneyCompleted && !hasReviewed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
