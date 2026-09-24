const Notification = require("../models/notification");
const NotificationPreference = require("../models/notificationPreference");
const Customer = require("../models/customer");

class NotificationService {
  // Localized templates for notifications
  static getLocalizedTemplates(type, lang = "en", params = {}) {
    const isHi = lang === "hi";
    const templates = {
      booking_confirmation: {
        title: isHi ? "बुकिंग की पुष्टि हुई! 🎉" : "Booking Confirmed! 🎉",
        message: isHi
          ? `आपकी बस यात्रा की पुष्टि हो गई है। बुकिंग आईडी: ${params.bookingId || ""}`
          : `Your bus journey has been confirmed. Booking ID: ${params.bookingId || ""}`
      },
      booking_cancellation: {
        title: isHi ? "बुकिंग रद्द कर दी गई ❌" : "Booking Cancelled ❌",
        message: isHi
          ? `आपकी बुकिंग रद्द कर दी गई है। बुकिंग आईडी: ${params.bookingId || ""}`
          : `Your booking has been cancelled. Booking ID: ${params.bookingId || ""}`
      },
      schedule_change: {
        title: isHi ? "समय सारिणी अपडेट 🕒" : "Schedule Change Alert 🕒",
        message: isHi
          ? `आपकी बस की समय सारिणी अपडेट की गई है: ${params.details || "कृपया नए समय की जांच करें।"}`
          : `Your bus schedule has been updated: ${params.details || "Please check updated timing."}`
      },
      journey_reminder: {
        title: isHi ? "आगामी यात्रा अनुस्मारक 🚌" : "Upcoming Journey Reminder 🚌",
        message: isHi
          ? `आपकी यात्रा जल्द ही शुरू होने वाली है! बुकिंग आईडी: ${params.bookingId || ""}`
          : `Your journey is coming up soon! Booking ID: ${params.bookingId || ""}`
      },
      promotion: {
        title: isHi ? "विशेष ऑफर आपके लिए! 🎁" : "Special Offer Just for You! 🎁",
        message: isHi
          ? `अपनी अगली बस यात्रा पर रोमांचक छूट प्राप्त करें। कूपन कोड: ${params.coupon || "REDBUS20"}`
          : `Get exciting discounts on your next bus journey. Use coupon: ${params.coupon || "REDBUS20"}`
      }
    };
    return templates[type] || null;
  }

  // Create notification
  static async createNotification(data) {
    try {
      const { recipient, type, data: notificationData } = data;
      let { title, message, language } = data;

      // Get user preferences
      const preferences = await NotificationPreference.findOne({ user: recipient });

      // If language not explicitly passed, determine from user preferences or customer profile
      if (!language) {
        if (preferences && preferences.language) {
          language = preferences.language;
        } else {
          const user = await Customer.findById(recipient).select("language");
          language = user?.language || "en";
        }
      }

      // If title or message missing, or using standard event type, generate localized text
      const template = this.getLocalizedTemplates(type, language, {
        bookingId: notificationData?.bookingId,
        details: notificationData?.details,
        coupon: notificationData?.coupon
      });

      if (template) {
        if (!title || language === "hi") title = template.title;
        if (!message || language === "hi") message = template.message;
      }

      title = title || "Notification";
      message = message || "";

      // Determine if notification should be sent based on preferences
      let shouldSend = true;
      let channels = { inApp: true, email: false, push: false };

      if (preferences) {
        const category = this.getCategoryFromType(type);
        const categoryPrefs = preferences.categories[category];

        if (categoryPrefs && !categoryPrefs.enabled) {
          shouldSend = false;
        } else if (categoryPrefs) {
          channels = categoryPrefs.channels;
        }
      }

      if (!shouldSend) {
        return null;
      }

      const notification = await Notification.create({
        recipient,
        type,
        title,
        message,
        data: notificationData || {},
        channels,
        language: language || "en",
      });

      // Trigger delivery based on channels
      if (channels.email) {
        this.sendEmail(notification);
      }
      if (channels.push) {
        this.sendPushNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Helper method for booking cancellation
  static async sendBookingCancellation(recipient, bookingId, details) {
    return this.createNotification({
      recipient,
      type: "booking_cancellation",
      data: { bookingId, details }
    });
  }

  // Helper method for schedule change
  static async sendScheduleChange(recipient, bookingId, details) {
    return this.createNotification({
      recipient,
      type: "schedule_change",
      data: { bookingId, details }
    });
  }

  // Helper method for journey reminder
  static async sendJourneyReminder(recipient, bookingId, details) {
    return this.createNotification({
      recipient,
      type: "journey_reminder",
      data: { bookingId, details }
    });
  }

  // Helper method for promotion
  static async sendPromotion(recipient, coupon, details) {
    return this.createNotification({
      recipient,
      type: "promotion",
      data: { coupon, details }
    });
  }

  // Get category from notification type
  static getCategoryFromType(type) {
    if (type.startsWith("booking")) return "booking";
    if (type.startsWith("community")) return "community";
    if (type === "promotion") return "promotions";
    return "booking";
  }

  // Send email notification
  static async sendEmail(notification) {
    try {
      // Update delivery status
      await Notification.findByIdAndUpdate(notification._id, {
        deliveryStatus: "sent",
        $inc: { deliveryAttempts: 1 },
      });

      // TODO: Implement actual email sending with nodemailer
      console.log(`Email sent to user ${notification.recipient}: ${notification.title}`);

      await Notification.findByIdAndUpdate(notification._id, {
        deliveryStatus: "delivered",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      await Notification.findByIdAndUpdate(notification._id, {
        deliveryStatus: "failed",
      });
    }
  }

  // Send push notification
  static async sendPushNotification(notification) {
    try {
      // Update delivery status
      await Notification.findByIdAndUpdate(notification._id, {
        deliveryStatus: "sent",
        $inc: { deliveryAttempts: 1 },
      });

      // TODO: Implement actual push notification with web-push
      console.log(`Push notification sent to user ${notification.recipient}: ${notification.title}`);

      await Notification.findByIdAndUpdate(notification._id, {
        deliveryStatus: "delivered",
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
      await Notification.findByIdAndUpdate(notification._id, {
        deliveryStatus: "failed",
      });
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, options = {}) {
    const { unreadOnly, limit = 50, skip = 0 } = options;

    const query = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Notification.countDocuments(query);

    return { notifications, total };
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true }
    );
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }

  // Get user preferences
  static async getUserPreferences(userId) {
    let preferences = await NotificationPreference.findOne({ user: userId });

    if (!preferences) {
      preferences = await NotificationPreference.create({ user: userId });
    }

    return preferences;
  }

  // Update user preferences
  static async updatePreferences(userId, preferencesData) {
    return await NotificationPreference.findOneAndUpdate(
      { user: userId },
      preferencesData,
      { upsert: true, new: true }
    );
  }

  // Retry failed notifications
  static async retryFailedNotifications() {
    const failedNotifications = await Notification.find({
      deliveryStatus: "failed",
      deliveryAttempts: { $lt: 3 },
    });

    for (const notification of failedNotifications) {
      if (notification.channels.email) {
        await this.sendEmail(notification);
      }
      if (notification.channels.push) {
        await this.sendPushNotification(notification);
      }
    }
  }
}

module.exports = NotificationService;
