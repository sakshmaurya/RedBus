import React, { useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";
import { useTranslation } from "react-i18next";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import "./ReviewCard.css";

const ReviewCard = ({ review, currentUserId, onEdit, onDelete, onReport }) => {
  const { t } = useTranslation();
  const [helpfulVoted, setHelpfulVoted] = useState(null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId && review.user._id === currentUserId;
  const isEditable = review.isEditable && isOwner;

  const handleHelpfulVote = async (isHelpful) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/${review._id}/helpful`,
        { isHelpful },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setHelpfulVoted(isHelpful ? "helpful" : "not-helpful");
        setHelpfulCount(response.data.helpfulCount);
      }
    } catch (error) {
      console.error("Error voting on review:", error);
      if (error.response?.status === 400) {
        // User already voted
        setHelpfulVoted(isHelpful ? "helpful" : "not-helpful");
      }
    }
  };

  const handleRemoveVote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/${review._id}/helpful`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setHelpfulVoted(null);
        setHelpfulCount(response.data.helpfulCount);
      }
    } catch (error) {
      console.error("Error removing vote:", error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/review-reports`,
        {
          reviewId: review._id,
          reason: reportReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowReportDialog(false);
        setReportReason("");
        if (onReport) {
          onReport(response.data.report);
        }
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      alert(error.response?.data?.message || "Failed to report review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-name">
            {review.user.name}
            {review.user.isTrustedReviewer && (
              <span className="trusted-badge">
                <VerifiedIcon fontSize="small" />
                {t('reviews.trustedReviewer')}
              </span>
            )}
          </div>
          <div className="review-date">{formatDate(review.createdAt)}</div>
        </div>
        <StarRating rating={review.rating} readonly size="small" />
      </div>

      <div className="review-content">
        <p>{review.reviewText}</p>
        {review.isEdited && (
          <span className="edited-badge">{t('reviews.edited')}</span>
        )}
      </div>

      <div className="review-actions">
        <div className="helpful-actions">
          {helpfulVoted === null ? (
            <>
              <button
                className="action-btn helpful-btn"
                onClick={() => handleHelpfulVote(true)}
                title={t('reviews.helpful')}
              >
                <ThumbUpIcon fontSize="small" />
                <span>{helpfulCount}</span>
              </button>
              <button
                className="action-btn not-helpful-btn"
                onClick={() => handleHelpfulVote(false)}
                title={t('reviews.notHelpful')}
              >
                <ThumbDownIcon fontSize="small" />
              </button>
            </>
          ) : (
            <button
              className="action-btn remove-vote-btn"
              onClick={handleRemoveVote}
              title={t('reviews.removeVote')}
            >
              {helpfulVoted === "helpful" ? (
                <>
                  <ThumbUpIcon fontSize="small" />
                  <span>{helpfulCount}</span>
                </>
              ) : (
                <ThumbDownIcon fontSize="small" />
              )}
            </button>
          )}
        </div>

        <div className="owner-actions">
          {!isOwner && (
            <button
              className="action-btn report-btn"
              onClick={() => setShowReportDialog(true)}
              title={t('reviews.report')}
            >
              <FlagIcon fontSize="small" />
            </button>
          )}

          {isEditable && (
            <>
              <button
                className="action-btn edit-btn"
                onClick={() => onEdit && onEdit(review)}
                title={t('reviews.edit')}
              >
                <EditIcon fontSize="small" />
              </button>
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete && onDelete(review)}
                title={t('reviews.delete')}
              >
                <DeleteIcon fontSize="small" />
              </button>
            </>
          )}
        </div>
      </div>

      {showReportDialog && (
        <div className="report-dialog-overlay">
          <div className="report-dialog">
            <h3>{t('reviews.reportReview')}</h3>
            <form onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label>{t('reviews.reportReason')}</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="">{t('reviews.selectReason')}</option>
                  <option value="Spam">{t('reviews.spam')}</option>
                  <option value="Offensive content">
                    {t('reviews.offensiveContent')}
                  </option>
                  <option value="Fake review">{t('reviews.fakeReview')}</option>
                  <option value="Harassment">{t('reviews.harassment')}</option>
                  <option value="Irrelevant content">
                    {t('reviews.irrelevantContent')}
                  </option>
                  <option value="Other">{t('reviews.other')}</option>
                </select>
              </div>
              <div className="dialog-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowReportDialog(false)}
                >
                  {t('reviews.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting || !reportReason}
                >
                  {isSubmitting ? t('reviews.submitting') : t('reviews.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
