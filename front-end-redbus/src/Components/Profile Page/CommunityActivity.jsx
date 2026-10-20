import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CommunityActivity.css";

const CommunityActivity = () => {
  const navigate = useNavigate();
  const currentCustomer = JSON.parse(localStorage.getItem("user")) || {};

  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's posts
  const fetchUserPosts = async () => {
    if (!currentCustomer._id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts?author=${currentCustomer._id}`
      );
      setUserPosts(res.data.posts || []);
    } catch (err) {
      console.log("Error fetching user posts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) {
    return <div className="communityActivity">Loading...</div>;
  }

  if (!currentCustomer._id) {
    return <div className="communityActivity">Please login to view your community activity</div>;
  }

  return (
    <div className="communityActivity">
      <h2>🌟 My Community Activity</h2>

      <div className="activityStats">
        <div className="statCard">
          <div className="statNumber">{userPosts.length}</div>
          <div className="statLabel">Posts Created</div>
        </div>
        <div className="statCard">
          <div className="statNumber">
            {userPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}
          </div>
          <div className="statLabel">Total Likes Received</div>
        </div>
        <div className="statCard">
          <div className="statNumber">
            {userPosts.reduce((sum, post) => sum + (post.comments || 0), 0)}
          </div>
          <div className="statLabel">Total Comments</div>
        </div>
      </div>

      <div className="verifiedStatus">
        {currentCustomer.isVerifiedTraveler ? (
          <div className="verifiedBadge">
            ✅ Verified Traveler - You can create posts in the community!
          </div>
        ) : (
          <div className="notVerifiedBadge">
            ℹ️ Complete at least one booking to become a verified traveler and create posts.
          </div>
        )}
      </div>

      <h3>My Posts</h3>
      {userPosts.length === 0 ? (
        <div className="noPosts">
          <p>You haven't created any posts yet.</p>
          {currentCustomer.isVerifiedTraveler && (
            <button onClick={() => navigate("/community")}>Create Your First Post</button>
          )}
        </div>
      ) : (
        <div className="postsList">
          {userPosts.map((post) => (
            <div key={post._id} className="postCard">
              <h4>{post.title}</h4>
              <p>{post.description.substring(0, 100)}...</p>
              <div className="postMeta">
                <span>❤️ {post.likes || 0} likes</span>
                <span>💬 {post.comments || 0} comments</span>
                <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityActivity;
