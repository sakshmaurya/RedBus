const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect, requireVerifiedTraveler } = require("../middleware/auth");

// Create Review
router.post("/v1/api/reviews", protect, requireVerifiedTraveler, reviewController.createReview);

// Get Reviews by Route
router.get("/v1/api/reviews/route/:routeId", reviewController.getReviewsByRoute);

// Get Reviews by User
router.get("/v1/api/reviews/user/:userId", protect, reviewController.getReviewsByUser);

// Update Review
router.put("/v1/api/reviews/:id", protect, reviewController.updateReview);

// Delete Review
router.delete("/v1/api/reviews/:id", protect, reviewController.deleteReview);

// Get Route Average Rating
router.get("/v1/api/reviews/rating/:routeId", reviewController.getRouteAverageRating);

// Mark Review as Helpful
router.post("/v1/api/reviews/:id/helpful", protect, reviewController.markReviewHelpful);

// Remove Helpful Vote
router.delete("/v1/api/reviews/:id/helpful", protect, reviewController.removeHelpfulVote);

// Get User's Review Eligibility
router.get("/v1/api/reviews/eligibility/:bookingId", protect, reviewController.getReviewEligibility);

module.exports = router;
