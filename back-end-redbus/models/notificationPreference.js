const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      unique: true,
    },
    categories: {
      booking: {
        enabled: {
          type: Boolean,
          default: true,
        },
        channels: {
          inApp: {
            type: Boolean,
            default: true,
          },
          email: {
            type: Boolean,
            default: true,
          },
          push: {
            type: Boolean,
            default: false,
          },
        },
      },
      community: {
        enabled: {
          type: Boolean,
          default: true,
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
      },
      promotions: {
        enabled: {
          type: Boolean,
          default: false,
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

module.exports = mongoose.model("NotificationPreference", notificationPreferenceSchema);
