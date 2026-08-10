const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. Please log in.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await Customer.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Please log in again.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired. Please log in again.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

// Check if user is verified traveler
exports.requireVerifiedTraveler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isVerifiedTraveler) {
      return res.status(403).json({
        success: false,
        message: "Only verified travelers can access this feature. Please complete at least one booking to become verified.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in verification check",
    });
  }
};

// Check if user is admin (for admin routes)
exports.requireAdmin = async (req, res, next) => {
  try {
    // Check if user has admin role or is from admin login
    const admin = req.headers["x-admin-auth"];
    
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in admin check",
    });
  }
};
