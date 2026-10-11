const Post = require("../models/post");
const NotificationService = require("../services/notificationService");

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.likes += 1;

    await post.save();

    // Send notification to post author
    if (post.author && req.body.likerId && post.author.toString() !== req.body.likerId) {
      await NotificationService.createNotification({
        recipient: post.author,
        type: "community_like",
        title: "Someone liked your post! ❤️",
        message: `${req.body.likerName || "Someone"} liked your post "${post.title}"`,
        data: { postId: post._id },
      });
    }

    res.json({
      success: true,
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};