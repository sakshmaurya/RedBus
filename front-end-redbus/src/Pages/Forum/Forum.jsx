import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Forum.css";

const Forum = () => {
  const navigate = useNavigate();
  const currentCustomer = JSON.parse(localStorage.getItem("user")) || {};

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
  });

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/forum/categories`
      );
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log("Error fetching categories:", err);
    }
  };

  // Fetch Topics by Category
  const fetchTopics = async (categoryId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/forum/categories/${categoryId}/topics`
      );
      setTopics(res.data.topics || []);
    } catch (err) {
      console.log("Error fetching topics:", err);
    }
    setLoading(false);
  };

  // Create Topic
  const createTopic = async () => {
    if (!currentCustomer || !currentCustomer._id) {
      alert("Please login to create a topic");
      navigate("/login");
      return;
    }

    if (!newTopic.title || !newTopic.content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/forum/topics`,
        {
          category: selectedCategory._id,
          title: newTopic.title,
          content: newTopic.content,
          author: currentCustomer._id,
          authorName: currentCustomer.name,
          authorProfile: currentCustomer.profilePicture || "",
        }
      );

      alert("Topic created successfully!");
      setNewTopic({ title: "", content: "" });
      setShowCreateTopic(false);
      fetchTopics(selectedCategory._id);
      fetchCategories();
    } catch (err) {
      alert("Error creating topic");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchTopics(category._id);
  };

  return (
    <div className="forum">
      <h1>💬 Travel Forum</h1>
      <p>Join discussions about routes, destinations, and travel advice</p>

      {!selectedCategory ? (
        <div className="categories">
          <h2>Discussion Categories</h2>
          <div className="categoryGrid">
            {categories.map((category) => (
              <div
                key={category._id}
                className="categoryCard"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="categoryIcon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="categoryStats">
                  <span>📝 {category.topicCount} Topics</span>
                  <span>💬 {category.replyCount} Replies</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="topics">
          <button
            className="backButton"
            onClick={() => {
              setSelectedCategory(null);
              setTopics([]);
            }}
          >
            ← Back to Categories
          </button>

          <h2>{selectedCategory.icon} {selectedCategory.name}</h2>
          <p>{selectedCategory.description}</p>

          <button
            className="createTopicButton"
            onClick={() => setShowCreateTopic(true)}
          >
            + Create New Topic
          </button>

          {showCreateTopic && (
            <div className="createTopicForm">
              <h3>Create New Topic</h3>
              <input
                type="text"
                placeholder="Topic Title"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, title: e.target.value })
                }
              />
              <textarea
                placeholder="Your question or discussion topic..."
                value={newTopic.content}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, content: e.target.value })
                }
              />
              <div className="formButtons">
                <button onClick={createTopic}>Post Topic</button>
                <button onClick={() => setShowCreateTopic(false)}>Cancel</button>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading topics...</p>
          ) : (
            <div className="topicList">
              {topics.length === 0 ? (
                <p>No topics yet. Be the first to start a discussion!</p>
              ) : (
                topics.map((topic) => (
                  <div
                    key={topic._id}
                    className="topicCard"
                    onClick={() => navigate(`/forum/topic/${topic._id}`)}
                  >
                    {topic.isPinned && <span className="pinnedBadge">📌 Pinned</span>}
                    <h3>{topic.title}</h3>
                    <p>{topic.content.substring(0, 150)}...</p>
                    <div className="topicMeta">
                      <span>👤 {topic.authorName}</span>
                      <span>💬 {topic.replyCount} replies</span>
                      <span>👁️ {topic.viewCount} views</span>
                      <span>📅 {new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Forum;
