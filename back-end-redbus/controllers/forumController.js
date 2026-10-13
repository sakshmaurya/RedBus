const ForumCategory = require("../models/forumCategory");
const ForumTopic = require("../models/forumTopic");
const ForumReply = require("../models/forumReply");
const Customer = require("../models/customer");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const category = await ForumCategory.create({
      name,
      description,
      icon: icon || "💬",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ForumCategory.find().sort({ topicCount: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create Topic
exports.createTopic = async (req, res) => {
  try {
    const { category, title, content, author, authorName, authorProfile } = req.body;

    // Check if user is verified traveler
    if (author) {
      const user = await Customer.findById(author);
      if (!user || !user.isVerifiedTraveler) {
        return res.status(403).json({
          success: false,
          message: "Only verified travelers can create forum topics. Please complete a booking first.",
        });
      }
    }

    const topic = await ForumTopic.create({
      category,
      title,
      content,
      author,
      authorName,
      authorProfile: authorProfile || "",
    });

    // Update category topic count
    await ForumCategory.findByIdAndUpdate(category, {
      $inc: { topicCount: 1 },
      lastActivity: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Topics by Category
exports.getTopicsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const topics = await ForumTopic.find({ category: categoryId })
      .populate("category", "name")
      .sort({ isPinned: -1, lastReplyAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      topics,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Topic
exports.getTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await ForumTopic.findById(topicId)
      .populate("category", "name")
      .populate("author", "name profilePicture");

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Increment view count
    await ForumTopic.findByIdAndUpdate(topicId, {
      $inc: { viewCount: 1 },
    });

    res.status(200).json({
      success: true,
      topic,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Add Reply
exports.addReply = async (req, res) => {
  try {
    const { topic, author, authorName, authorProfile, content, parentReply } = req.body;

    const reply = await ForumReply.create({
      topic,
      author,
      authorName,
      authorProfile: authorProfile || "",
      content,
      parentReply: parentReply || null,
    });

    // Update topic reply count and last activity
    await ForumTopic.findByIdAndUpdate(topic, {
      $inc: { replyCount: 1 },
      lastReplyAt: new Date(),
      lastReplyBy: authorName,
    });

    // Update category reply count
    const topicData = await ForumTopic.findById(topic);
    await ForumCategory.findByIdAndUpdate(topicData.category, {
      $inc: { replyCount: 1 },
      lastActivity: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      reply,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Replies for Topic
exports.getReplies = async (req, res) => {
  try {
    const { topicId } = req.params;

    const replies = await ForumReply.find({ topic: topicId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      replies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Topic (Admin only)
exports.deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await ForumTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Delete all replies
    await ForumReply.deleteMany({ topic: topicId });

    // Update category
    await ForumCategory.findByIdAndUpdate(topic.category, {
      $inc: { topicCount: -1, replyCount: -topic.replyCount },
    });

    await ForumTopic.findByIdAndDelete(topicId);

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Pin Topic (Admin only)
exports.pinTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await ForumTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    topic.isPinned = !topic.isPinned;
    await topic.save();

    res.status(200).json({
      success: true,
      message: topic.isPinned ? "Topic pinned" : "Topic unpinned",
      topic,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Lock Topic (Admin only)
exports.lockTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await ForumTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    topic.isLocked = !topic.isLocked;
    await topic.save();

    res.status(200).json({
      success: true,
      message: topic.isLocked ? "Topic locked" : "Topic unlocked",
      topic,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
