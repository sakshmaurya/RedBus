const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const upload = require("../middleware/upload");


router.post(
"/v1/api/posts",
upload("images",5),
postController.createPost
);


router.get(
"/v1/api/posts",
postController.getPosts
);


router.get(
"/v1/api/posts/all",
postController.getAllPosts
);


router.get(
"/v1/api/posts/trending",
postController.getTrendingPosts
);


router.delete(
"/v1/api/posts/:id",
postController.deletePost
);


router.patch(
"/v1/api/posts/:id/status",
postController.updatePostStatus
);


router.patch(
"/v1/api/posts/:id",
postController.updatePost
);


router.patch(
"/v1/api/posts/:id/pin",
postController.pinPost
);


router.post(
"/v1/api/posts/:id/like",
postController.likePost
);


router.post(
"/v1/api/posts/:id/comment",
postController.addComment
);


module.exports = router;