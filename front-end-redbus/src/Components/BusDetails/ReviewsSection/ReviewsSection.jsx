import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewList from "../../Reviews/ReviewList";
import ReviewForm from "../../Reviews/ReviewForm";
import StarRating from "../../Reviews/StarRating";
import { useTranslation } from "react-i18next";
import "./ReviewsSection.css";

const ReviewsSection = ({ routeId, busId, bookingId, currentUserId }) => {
  const { t } = useTranslation();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchRouteRating();
  }, [routeId]);

  const fetchRouteRating = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/rating/${routeId}`
      );

      if (response.data.success) {
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching route rating:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    fetchRouteRating(); // Refresh rating after new review
  };

  const handleReviewEdit = (review) => {
    console.log("Edit review:", review);
    // Implement edit functionality
  };

  const handleReviewDelete = (review) => {
    setReviews(reviews.filter((r) => r._id !== review._id));
    fetchRouteRating(); // Refresh rating after deletion
  };

  const handleReviewReport = (report) => {
    console.log("Review reported:", report);
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>{t('reviews.recentReviews')}</h2>
        <div className="rating-summary">
          <StarRating rating={Math.round(averageRating)} readonly size="large" />
          <div className="rating-info">
            <div className="average-rating">{averageRating}</div>
            <div className="total-reviews">{totalReviews} {t('reviews.reviews')}</div>
          </div>
        </div>
      </div>

      {currentUserId && bookingId && (
        <div className="review-form-toggle">
          {!showReviewForm ? (
            <button
              className="btn-write-review"
              onClick={() => setShowReviewForm(true)}
            >
              {t('reviews.writeReview')}
            </button>
          ) : (
            <button
              className="btn-cancel-review"
              onClick={() => setShowReviewForm(false)}
            >
              {t('reviews.cancel')}
            </button>
          )}
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          bookingId={bookingId}
          busId={busId}
          routeId={routeId}
          onSuccess={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      <ReviewList
        routeId={routeId}
        currentUserId={currentUserId}
        onEdit={handleReviewEdit}
        onDelete={handleReviewDelete}
        onReport={handleReviewReport}
      />
    </div>
  );
};

export default ReviewsSection;
