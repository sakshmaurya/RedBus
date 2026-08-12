const Customer = require("../models/customer");
const Booking = require("../models/booking");

// will add customer if custmer with that email does not exist
exports.addNewCustomer = async (req, res) => {
  let email = req.body.email;
  let existingCustomer = await Customer.findOne({ email: email }).lean().exec();
  if (existingCustomer) {
    res.send(existingCustomer);
  } else {
    let newCustomer = await Customer.create(req.body);
    res.send(newCustomer);
  }
};

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Customer.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await Customer.countDocuments();
    const verifiedTravelers = await Customer.countDocuments({ isVerifiedTraveler: true });
    const activeUsers = await Customer.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        verifiedTravelers,
        activeUsers,
        verificationRate: totalUsers > 0 ? ((verifiedTravelers / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update user preferences (language, theme)
exports.updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { language, theme } = req.body;
    
    const updateData = {};
    if (language) updateData.language = language;
    if (theme) updateData.theme = theme;
    
    const user = await Customer.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get user preferences
exports.getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await Customer.findById(userId).select('language theme');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      preferences: {
        language: user.language || 'en',
        theme: user.theme || 'light'
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Toggle user verified traveler status (Admin)
exports.toggleUserVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.isVerifiedTraveler = !user.isVerifiedTraveler;
    await user.save();
    res.json({
      success: true,
      message: `User ${user.isVerifiedTraveler ? 'verified' : 'unverified'} successfully`,
      isVerifiedTraveler: user.isVerifiedTraveler
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Customer.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
