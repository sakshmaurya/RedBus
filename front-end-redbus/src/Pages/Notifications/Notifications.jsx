import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

const Notifications = () => {
  const navigate = useNavigate();
  const currentCustomer = JSON.parse(localStorage.getItem("user")) || {};

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentCustomer._id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications`,
        {
          params: {
            userId: currentCustomer._id,
            unreadOnly: filter === "unread",
          },
        }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log("Error fetching notifications:", err);
    }
    setLoading(false);
  };

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications/${notificationId}/read`,
        { userId: currentCustomer._id }
      );
      fetchNotifications();
    } catch (err) {
      console.log("Error marking as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications/read-all`,
        { userId: currentCustomer._id }
      );
      fetchNotifications();
    } catch (err) {
      console.log("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  if (loading) {
    return <div className="notifications">Loading...</div>;
  }

  if (!currentCustomer._id) {
    return <div className="notifications">Please login to view notifications</div>;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications">
      <div className="notificationsHeader">
        <h1>🔔 Notifications</h1>
        <div className="headerActions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filterSelect"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </select>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="markAllReadBtn">
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="noNotifications">
          <p>No notifications found</p>
        </div>
      ) : (
        <div className="notificationsList">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notificationCard ${!notification.isRead ? "unread" : ""}`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="notificationIcon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notificationContent">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notificationTime">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.isRead && <div className="unreadDot"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case "booking_confirmation":
      return "✅";
    case "booking_cancellation":
      return "❌";
    case "schedule_change":
      return "🔄";
    case "journey_reminder":
      return "⏰";
    case "promotion":
      return "🎉";
    case "community_like":
      return "❤️";
    case "community_comment":
      return "💬";
    case "community_reply":
      return "↩️";
    default:
      return "🔔";
  }
};

export default Notifications;
