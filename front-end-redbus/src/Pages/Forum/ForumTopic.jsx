import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Forum.css";

const ForumTopic = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const currentCustomer = JSON.parse(localStorage.getItem("user")) || {};

  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  // Fetch Topic
  const fetchTopic = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/forum/topics/${topicId}`
      );
      setTopic(res.data.topic);
    } catch (err) {
      console.log("Error fetching topic:", err);
    }
  };

  // Fetch Replies
  const fetchReplies = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/forum/topics/${topicId}/replies`
      );
      setReplies(res.data.replies || []);
    } catch (err) {
      console.log("Error fetching replies:", err);
    }
  };

  // Add Reply
  const addReply = async () => {
    if (!currentCustomer || !currentCustomer._id) {
      alert("Please login to reply");
      navigate("/login");
      return;
    }

    if (!replyText.trim()) {
      alert("Please enter a reply");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/forum/replies`,
        {
          topic: topicId,
          author: currentCustomer._id,
          authorName: currentCustomer.name,
          authorProfile: currentCustomer.profilePicture || "",
          content: replyText,
        }
      );

      setReplyText("");
      fetchReplies();
      fetchTopic();
    } catch (err) {
      alert("Error adding reply");
    }
  };

  useEffect(() => {
    fetchTopic();
    fetchReplies();
    setLoading(false);
  }, [topicId]);

  if (loading) {
    return <div className="forum">Loading...</div>;
  }

  if (!topic) {
    return <div className="forum">Topic not found</div>;
  }

  return (
    <div className="forum">
      <button
        className="backButton"
        onClick={() => navigate("/forum")}
      >
        ← Back to Forum
      </button>

      <div className="topicDetail">
        {topic.isPinned && <span className="pinnedBadge">📌 Pinned</span>}
        {topic.isLocked && <span className="lockedBadge">🔒 Locked</span>}

        <h1>{topic.title}</h1>

        <div className="topicAuthor">
          <div className="authorAvatar">
            {topic.authorName ? topic.authorName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <strong>{topic.authorName}</strong>
            <p>{new Date(topic.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="topicContent">{topic.content}</div>

        <div className="topicStats">
          <span>💬 {topic.replyCount} Replies</span>
          <span>👁️ {topic.viewCount} Views</span>
        </div>

        {!topic.isLocked && (
          <div className="replyForm">
            <h3>Add Your Reply</h3>
            <textarea
              placeholder="Share your thoughts..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={addReply}>Post Reply</button>
          </div>
        )}

        {topic.isLocked && (
          <div className="lockedMessage">
            🔒 This topic is locked and no longer accepts new replies.
          </div>
        )}

        <div className="repliesSection">
          <h3>Replies ({replies.length})</h3>
          {replies.length === 0 ? (
            <p>No replies yet. Be the first to share your thoughts!</p>
          ) : (
            replies.map((reply) => (
              <div key={reply._id} className="replyCard">
                <div className="replyAuthor">
                  <div className="authorAvatar">
                    {reply.authorName ? reply.authorName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <strong>{reply.authorName}</strong>
                    <p>{new Date(reply.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="replyContent">{reply.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumTopic;
