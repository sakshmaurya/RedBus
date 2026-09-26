const NotificationService = require("../services/notificationService");

// Get User Notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.query?.userId || req.body?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    const { unreadOnly, limit, skip } = req.query;

    const result = await NotificationService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === "true",
      limit: parseInt(limit) || 50,
      skip: parseInt(skip) || 0,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id || req.user?.id || req.body?.userId || req.query?.userId;

    const notification = await NotificationService.markAsRead(notificationId, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Mark All Notifications as Read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.body?.userId || req.query?.userId;

    await NotificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User Preferences
exports.getUserPreferences = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.query?.userId || req.body?.userId;

    const preferences = await NotificationService.getUserPreferences(userId);

    res.status(200).json({
      success: true,
      preferences,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update User Preferences
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.body?.userId || req.query?.userId;
    const preferencesData = req.body;

    const preferences = await NotificationService.updatePreferences(userId, preferencesData);

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create Notification (Internal use)
exports.createNotification = async (req, res) => {
  try {
    const notification = await NotificationService.createNotification(req.body);

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Retry Failed Notifications (Admin/Cron job)
exports.retryFailedNotifications = async (req, res) => {
  try {
    await NotificationService.retryFailedNotifications();

    res.status(200).json({
      success: true,
      message: "Failed notifications retried",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Send Schedule Change Alert (Admin/System)
exports.sendScheduleChange = async (req, res) => {
  try {
    const { recipient, bookingId, details } = req.body;
    const notification = await NotificationService.sendScheduleChange(recipient, bookingId, details);
    res.status(201).json({
      success: true,
      message: "Schedule change notification sent",
      notification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send Journey Reminder (System/Cron)
exports.sendJourneyReminder = async (req, res) => {
  try {
    const { recipient, bookingId, details } = req.body;
    const notification = await NotificationService.sendJourneyReminder(recipient, bookingId, details);
    res.status(201).json({
      success: true,
      message: "Journey reminder notification sent",
      notification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send Promotion Notification (Marketing/Admin)
exports.sendPromotion = async (req, res) => {
  try {
    const { recipient, coupon, details } = req.body;
    const notification = await NotificationService.sendPromotion(recipient, coupon, details);
    res.status(201).json({
      success: true,
      message: "Promotion notification sent",
      notification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
