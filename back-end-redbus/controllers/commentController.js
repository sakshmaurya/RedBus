const Comment = require("../models/comment");
const Post = require("../models/post");
const NotificationService = require("../services/notificationService");

// Create Comment
exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);

    await Post.findByIdAndUpdate(req.body.postId, {
      $inc: { comments: 1 },
    });

    // Send notification to post author
    const post = await Post.findById(req.body.postId);
    if (post && post.author && req.body.author && post.author.toString() !== req.body.author) {
      await NotificationService.createNotification({
        recipient: post.author,
        type: "community_comment",
        title: "Someone commented on your post! 💬",
        message: `${req.body.authorName || "Someone"} commented on your post "${post.title}"`,
        data: { postId: post._id, commentId: comment._id },
      });
    }

    res.json({
      success: true,
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get Comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};