import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import { useTranslation } from "react-i18next";
import "./ReviewList.css";

const ReviewList = ({ routeId, currentUserId, onEdit, onDelete, onReport }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [routeId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/route/${routeId}`,
        {
          params: { page, limit: 5 },
        }
      );

      if (response.data.success) {
        if (page === 1) {
          setReviews(response.data.reviews);
        } else {
          setReviews([...reviews, ...response.data.reviews]);
        }
        setTotalPages(response.data.pagination.pages);
        setHasMore(page < response.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(t('reviews.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(page + 1);
    }
  };

  const handleReviewEdit = (review) => {
    if (onEdit) {
      onEdit(review);
    }
  };

  const handleReviewDelete = (review) => {
    if (onDelete) {
      onDelete(review);
    }
  };

  const handleReviewReport = (report) => {
    if (onReport) {
      onReport(report);
    }
  };

  if (loading && page === 1) {
    return <div className="review-list-loading">{t('reviews.loading')}</div>;
  }

  if (error) {
    return <div className="review-list-error">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="review-list-empty">{t('reviews.noReviews')}</div>;
  }

  return (
    <div className="review-list">
      <h3 className="review-list-title">{t('reviews.recentReviews')}</h3>
      <div className="review-list-content">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            currentUserId={currentUserId}
            onEdit={handleReviewEdit}
            onDelete={handleReviewDelete}
            onReport={handleReviewReport}
          />
        ))}
      </div>
      {hasMore && (
        <button
          className="load-more-btn"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? t('reviews.loading') : t('reviews.loadMore')}
        </button>
      )}
    </div>
  );
};

export default ReviewList;
