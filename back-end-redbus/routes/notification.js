const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");

// Get user notifications
router.get("/v1/api/notifications", notificationController.getUserNotifications);

// Mark notification as read
router.put("/v1/api/notifications/:notificationId/read", notificationController.markAsRead);

// Mark all notifications as read
router.put("/v1/api/notifications/read-all", notificationController.markAllAsRead);

// Get user preferences
router.get("/v1/api/notifications/preferences", notificationController.getUserPreferences);

// Update user preferences
router.put("/v1/api/notifications/preferences", notificationController.updatePreferences);

// Create notification (internal use)
router.post("/v1/api/notifications", notificationController.createNotification);

// Retry failed notifications (admin/cron)
router.post("/v1/api/notifications/retry", notificationController.retryFailedNotifications);

// Schedule change alert
router.post("/v1/api/notifications/schedule-change", notificationController.sendScheduleChange);

// Journey reminder
router.post("/v1/api/notifications/journey-reminder", notificationController.sendJourneyReminder);

// Promotional notification
router.post("/v1/api/notifications/promotion", notificationController.sendPromotion);

module.exports = router;
