import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewCard from "../../Reviews/ReviewCard";
import { useTranslation } from "react-i18next";
import "./MyReviews.css";

const MyReviews = ({ userId }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [userId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/user/${userId}`,
        {
          params: { page, limit: 5 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    console.log("Edit review:", review);
    // Implement edit functionality - could open a modal
  };

  const handleReviewDelete = async (review) => {
    if (!window.confirm(t('reviews.delete'))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/${review._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(reviews.filter((r) => r._id !== review._id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error.response?.data?.message || "Failed to delete review");
    }
  };

  const handleReviewReport = (report) => {
    console.log("Review reported:", report);
  };

  if (loading && page === 1) {
    return <div className="my-reviews-loading">{t('reviews.loading')}</div>;
  }

  if (error) {
    return <div className="my-reviews-error">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="my-reviews-empty">{t('reviews.noReviews')}</div>;
  }

  return (
    <div className="my-reviews">
      <h3 className="my-reviews-title">{t('reviews.myReviews')}</h3>
      <div className="my-reviews-list">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            currentUserId={userId}
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

export default MyReviews;
