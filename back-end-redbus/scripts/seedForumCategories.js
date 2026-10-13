const mongoose = require("mongoose");
const ForumCategory = require("../models/forumCategory");

require("dotenv").config({ path: "../config.env" });

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing categories
    await ForumCategory.deleteMany({});
    console.log("Cleared existing categories");

    // Seed categories
    const categories = [
      {
        name: "Route Discussions",
        description: "Discuss bus routes, schedules, and travel experiences on specific routes",
        icon: "🚌",
      },
      {
        name: "Destination Guides",
        description: "Share information about destinations, attractions, and local tips",
        icon: "📍",
      },
      {
        name: "Travel Advice",
        description: "Get and share travel tips, packing advice, and travel planning help",
        icon: "💡",
      },
      {
        name: "Bus Reviews",
        description: "Review and discuss different bus operators and their services",
        icon: "⭐",
      },
      {
        name: "Travel Stories",
        description: "Share your travel experiences and memorable journeys",
        icon: "📖",
      },
    ];

    await ForumCategory.insertMany(categories);
    console.log("Seeded forum categories successfully");

    mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
