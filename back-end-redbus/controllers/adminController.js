const Customer = require("../models/customer");
const Post = require("../models/post");
const Booking = require("../models/booking");
const Bus = require("../models/bus");
const Route = require("../models/route");
const Review = require("../models/review");
const Report = require("../models/report");
const ReviewReport = require("../models/reviewReport");

// Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await Customer.countDocuments();
    const verifiedUsers = await Customer.countDocuments({ isVerifiedTraveler: true });
    const totalPosts = await Post.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalReviewReports = await ReviewReport.countDocuments();
    const totalReviews = await Review.countDocuments();

    const bookings = await Booking.find();
    let totalRevenue = 0;
    let upcomingBookings = 0;
    let completedBookings = 0;
    let cancelledBookings = 0;

    bookings.forEach((booking) => {
      const amount = Number(booking.fare) || Number(booking.price) || 0;
      totalRevenue += amount;
      if (booking.journeyStatus === "COMPLETED" || booking.status === "completed") {
        completedBookings++;
      } else if (booking.journeyStatus === "CANCELLED" || booking.status === "cancelled") {
        cancelledBookings++;
      } else {
        upcomingBookings++;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        totalPosts,
        totalBookings,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        totalBuses,
        totalRoutes,
        totalReports,
        totalReviewReports,
        totalReviews,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};