const express = require("express");
const router = express.Router();

const likeController = require("../controllers/likeController");

router.post("/v1/api/posts/:id/like", likeController.likePost);

module.exports = router;