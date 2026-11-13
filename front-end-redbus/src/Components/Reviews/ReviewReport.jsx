import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./ReviewReport.css";

const ReviewReport = ({ reviewId, onSuccess, onClose }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!reason) {
      setError("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/review-reports`,
        {
          reviewId,
          reason,
          details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onSuccess) {
          onSuccess(response.data.report);
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      setError(
        error.response?.data?.message || "Failed to report review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-report-overlay">
      <div className="review-report-dialog">
        <div className="report-header">
          <h3>{t('reviews.reportReview')}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('reviews.reportReason')} *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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

          <div className="form-group">
            <label>{t('reviews.additionalDetails')}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t('reviews.detailsPlaceholder')}
              rows={4}
              maxLength={500}
            />
            <div className="character-count">
              {details.length} / 500
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="dialog-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('reviews.cancel')}
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || !reason}
            >
              {isSubmitting ? t('reviews.submitting') : t('reviews.submitReport')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewReport;
