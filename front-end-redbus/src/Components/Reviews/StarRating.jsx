import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./StarRating.css";

const StarRating = ({ rating, onRatingChange, readonly = false, size = "medium" }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case "small":
        return "16px";
      case "large":
        return "32px";
      default:
        return "24px";
    }
  };

  return (
    <div className="star-rating">
      {stars.map((starValue) => (
        <span
          key={starValue}
          className={`star ${starValue <= rating ? "filled" : "empty"} ${
            readonly ? "readonly" : "interactive"
          }`}
          onClick={() => handleStarClick(starValue)}
          style={{ fontSize: getStarSize() }}
        >
          {starValue <= rating ? <StarIcon /> : <StarBorderIcon />}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
