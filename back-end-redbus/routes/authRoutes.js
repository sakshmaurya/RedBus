const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

// Register
router.post("/api/auth/register", register);

// Login
router.post("/api/auth/login", login);

module.exports = router;