const mongoose = require("mongoose");

const forumReplySchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumTopic",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorProfile: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumReply",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ForumReply", forumReplySchema);
