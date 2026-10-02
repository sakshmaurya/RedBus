import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotificationPreferences.css";

const NotificationPreferences = () => {
  const currentCustomer = JSON.parse(localStorage.getItem("user")) || {};

  const [preferences, setPreferences] = useState({
    categories: {
      booking: {
        enabled: true,
        channels: {
          inApp: true,
          email: true,
          push: false,
        },
      },
      community: {
        enabled: true,
        channels: {
          inApp: true,
          email: false,
          push: false,
        },
      },
      promotions: {
        enabled: false,
        channels: {
          inApp: true,
          email: false,
          push: false,
        },
      },
    },
    language: "en",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!currentCustomer._id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications/preferences`,
        {
          params: { userId: currentCustomer._id },
        }
      );
      if (res.data.preferences) {
        setPreferences(res.data.preferences);
      }
    } catch (err) {
      console.log("Error fetching preferences:", err);
    }
    setLoading(false);
  };

  // Save preferences
  const savePreferences = async () => {
    if (!currentCustomer._id) return;

    setSaving(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications/preferences`,
        { userId: currentCustomer._id, ...preferences }
      );
      alert("Preferences saved successfully!");
    } catch (err) {
      console.log("Error saving preferences:", err);
      alert("Error saving preferences");
    }
    setSaving(false);
  };

  // Toggle category enabled
  const toggleCategory = (category) => {
    setPreferences({
      ...preferences,
      categories: {
        ...preferences.categories,
        [category]: {
          ...preferences.categories[category],
          enabled: !preferences.categories[category].enabled,
        },
      },
    });
  };

  // Toggle channel
  const toggleChannel = (category, channel) => {
    setPreferences({
      ...preferences,
      categories: {
        ...preferences.categories,
        [category]: {
          ...preferences.categories[category],
          channels: {
            ...preferences.categories[category].channels,
            [channel]: !preferences.categories[category].channels[channel],
          },
        },
      },
    });
  };

  // Set language
  const setLanguage = (lang) => {
    setPreferences({ ...preferences, language: lang });
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  if (loading) {
    return <div className="notificationPreferences">Loading...</div>;
  }

  if (!currentCustomer._id) {
    return <div className="notificationPreferences">Please login to manage preferences</div>;
  }

  return (
    <div className="notificationPreferences">
      <h1>⚙️ Notification Preferences</h1>

      <div className="preferencesContainer">
        {/* Language Selection */}
        <div className="preferenceSection">
          <h3>Language</h3>
          <div className="languageOptions">
            <button
              className={`langBtn ${preferences.language === "en" ? "active" : ""}`}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              className={`langBtn ${preferences.language === "hi" ? "active" : ""}`}
              onClick={() => setLanguage("hi")}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Booking Notifications */}
        <div className="preferenceSection">
          <div className="sectionHeader">
            <h3>🎫 Booking Notifications</h3>
            <label className="toggleSwitch">
              <input
                type="checkbox"
                checked={preferences.categories.booking.enabled}
                onChange={() => toggleCategory("booking")}
              />
              <span className="slider"></span>
            </label>
          </div>
          <p className="sectionDescription">
            Receive notifications about booking confirmations, cancellations, and journey reminders
          </p>
          {preferences.categories.booking.enabled && (
            <div className="channelOptions">
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.booking.channels.inApp}
                  onChange={() => toggleChannel("booking", "inApp")}
                />
                <span>In-App</span>
              </label>
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.booking.channels.email}
                  onChange={() => toggleChannel("booking", "email")}
                />
                <span>Email</span>
              </label>
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.booking.channels.push}
                  onChange={() => toggleChannel("booking", "push")}
                />
                <span>Push</span>
              </label>
            </div>
          )}
        </div>

        {/* Community Notifications */}
        <div className="preferenceSection">
          <div className="sectionHeader">
            <h3>💬 Community Notifications</h3>
            <label className="toggleSwitch">
              <input
                type="checkbox"
                checked={preferences.categories.community.enabled}
                onChange={() => toggleCategory("community")}
              />
              <span className="slider"></span>
            </label>
          </div>
          <p className="sectionDescription">
            Receive notifications when someone likes or comments on your posts
          </p>
          {preferences.categories.community.enabled && (
            <div className="channelOptions">
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.community.channels.inApp}
                  onChange={() => toggleChannel("community", "inApp")}
                />
                <span>In-App</span>
              </label>
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.community.channels.email}
                  onChange={() => toggleChannel("community", "email")}
                />
                <span>Email</span>
              </label>
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.community.channels.push}
                  onChange={() => toggleChannel("community", "push")}
                />
                <span>Push</span>
              </label>
            </div>
          )}
        </div>

        {/* Promotion Notifications */}
        <div className="preferenceSection">
          <div className="sectionHeader">
            <h3>🎉 Promotions</h3>
            <label className="toggleSwitch">
              <input
                type="checkbox"
                checked={preferences.categories.promotions.enabled}
                onChange={() => toggleCategory("promotions")}
              />
              <span className="slider"></span>
            </label>
          </div>
          <p className="sectionDescription">
            Receive notifications about special offers and promotions
          </p>
          {preferences.categories.promotions.enabled && (
            <div className="channelOptions">
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.promotions.channels.inApp}
                  onChange={() => toggleChannel("promotions", "inApp")}
                />
                <span>In-App</span>
              </label>
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.promotions.channels.email}
                  onChange={() => toggleChannel("promotions", "email")}
                />
                <span>Email</span>
              </label>
              <label className="channelOption">
                <input
                  type="checkbox"
                  checked={preferences.categories.promotions.channels.push}
                  onChange={() => toggleChannel("promotions", "push")}
                />
                <span>Push</span>
              </label>
            </div>
          )}
        </div>

        <div className="saveButtonContainer">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="saveButton"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
