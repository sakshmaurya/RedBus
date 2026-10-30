import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "./StarRating";
import { useTranslation } from "react-i18next";
import "./ReviewForm.css";

const ReviewForm = ({ bookingId, busId, routeId, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  const MIN_CHARS = 50;
  const MAX_CHARS = 500;

  useEffect(() => {
    checkEligibility();
  }, [bookingId]);

  const checkEligibility = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/eligibility/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEligibility(response.data.eligibility);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      setError("Failed to check review eligibility");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (reviewText.length < MIN_CHARS) {
      setError(`Review must contain at least ${MIN_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews`,
        {
          bookingId,
          busId,
          routeId,
          rating,
          reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onSuccess) {
          onSuccess(response.data.review);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(
        error.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="review-form-loading">Loading...</div>;
  }

  if (!eligibility || !eligibility.canReview) {
    if (eligibility && !eligibility.isJourneyCompleted) {
      return (
        <div className="review-form-message">
          <p>You can only review completed journeys.</p>
        </div>
      );
    }
    if (eligibility && eligibility.hasReviewed) {
      return (
        <div className="review-form-message">
          <p>You have already reviewed this journey.</p>
        </div>
      );
    }
    return (
      <div className="review-form-message">
        <p>You are not eligible to review this journey.</p>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h3>{t('reviews.writeReview')}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('reviews.rating')}</label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="large"
          />
        </div>

        <div className="form-group">
          <label>{t('reviews.yourExperience')}</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t('reviews.reviewPlaceholder')}
            maxLength={MAX_CHARS}
            rows={6}
          />
          <div className="character-count">
            {reviewText.length} / {MAX_CHARS} {t('reviews.characters')}
            {reviewText.length < MIN_CHARS && (
              <span className="min-chars-warning">
                (Minimum {MIN_CHARS} characters required)
              </span>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('reviews.cancel')}
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting || rating === 0 || reviewText.length < MIN_CHARS}
          >
            {isSubmitting ? t('reviews.submitting') : t('reviews.submitReview')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
