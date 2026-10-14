const express = require("express");
const router = express.Router();

const forumController = require("../controllers/forumController");

// Categories
router.post("/v1/api/forum/categories", forumController.createCategory);
router.get("/v1/api/forum/categories", forumController.getCategories);

// Topics
router.post("/v1/api/forum/topics", forumController.createTopic);
router.get("/v1/api/forum/categories/:categoryId/topics", forumController.getTopicsByCategory);
router.get("/v1/api/forum/topics/:topicId", forumController.getTopic);
router.delete("/v1/api/forum/topics/:topicId", forumController.deleteTopic);
router.put("/v1/api/forum/topics/:topicId/pin", forumController.pinTopic);
router.put("/v1/api/forum/topics/:topicId/lock", forumController.lockTopic);

// Replies
router.post("/v1/api/forum/replies", forumController.addReply);
router.get("/v1/api/forum/topics/:topicId/replies", forumController.getReplies);

module.exports = router;
