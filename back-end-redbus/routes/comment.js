const express = require("express");

const router = express.Router();

const commentController = require("../controllers/commentController");

router.post(
  "/v1/api/posts/:id/comment",
  commentController.addComment
);

router.get(
  "/v1/api/posts/:id/comments",
  commentController.getComments
);

module.exports = router;