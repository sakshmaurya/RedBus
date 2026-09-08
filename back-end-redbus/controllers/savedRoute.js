const SavedRoute = require("../models/savedRoute");

// Create saved route
exports.createSavedRoute = async (req, res) => {
  try {
    const savedRoute = await SavedRoute.create(req.body);
    res.status(201).json({
      success: true,
      savedRoute
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get all saved routes for a user
exports.getUserSavedRoutes = async (req, res) => {
  try {
    const { userId } = req.params;
    const savedRoutes = await SavedRoute.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      savedRoutes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get single saved route
exports.getSavedRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const savedRoute = await SavedRoute.findById(id);
    
    if (!savedRoute) {
      return res.status(404).json({
        success: false,
        message: "Saved route not found"
      });
    }
    
    res.json({
      success: true,
      savedRoute
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Delete saved route
exports.deleteSavedRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const savedRoute = await SavedRoute.findByIdAndDelete(id);
    
    if (!savedRoute) {
      return res.status(404).json({
        success: false,
        message: "Saved route not found"
      });
    }
    
    res.json({
      success: true,
      message: "Saved route deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update saved route
exports.updateSavedRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const savedRoute = await SavedRoute.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!savedRoute) {
      return res.status(404).json({
        success: false,
        message: "Saved route not found"
      });
    }
    
    res.json({
      success: true,
      savedRoute
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
