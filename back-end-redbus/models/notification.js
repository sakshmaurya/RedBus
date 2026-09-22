const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "booking_confirmation",
        "booking_cancellation",
        "schedule_change",
        "journey_reminder",
        "promotion",
        "community_like",
        "community_comment",
        "community_reply",
        "review_helpful",
        "review_reported",
        "review_moderated",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "pending",
    },
    deliveryAttempts: {
      type: Number,
      default: 0,
    },
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
    language: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
