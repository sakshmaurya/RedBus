const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  isVerifiedTraveler: {
    type: Boolean,
    default: false,
  },
  totalPosts: {
    type: Number,
    default: 0,
  },
  totalLikesReceived: {
    type: Number,
    default: 0,
  },
  // Review-related fields
  helpfulVotesReceived: {
    type: Number,
    default: 0,
  },
  isTrustedReviewer: {
    type: Boolean,
    default: false,
  },
  // User preferences for i18n and dark mode
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  }
});

module.exports = mongoose.model("Customers", customerSchema);
