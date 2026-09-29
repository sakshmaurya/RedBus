const Booking = require("../models/booking");
const NotificationService = require("../services/notificationService");

exports.addBooking = async (req, res) => {
  try {
    console.log("Creating booking with data:", req.body);
    const booking = await Booking.create(req.body);
    console.log("Booking created successfully:", booking);

    // Send booking confirmation notification
    try {
      await NotificationService.createNotification({
        recipient: booking.customerId,
        type: "booking_confirmation",
        title: "Booking Confirmed! 🎉",
        message: `Your booking has been confirmed. Booking ID: ${booking._id}`,
        data: { bookingId: booking._id },
      });
      console.log("Notification sent successfully");
    } catch (notifError) {
      console.log("Error sending notification (booking still created):", notifError);
    }

    // Mark user as verified traveler after first booking
    try {
      const Customer = require("../models/customer");
      await Customer.findByIdAndUpdate(booking.customerId, {
        isVerifiedTraveler: true,
      });
      console.log("User marked as verified traveler");
    } catch (customerError) {
      console.log("Error marking user as verified (booking still created):", customerError);
    }

    res.send(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    let { id } = req.params;
    const bookings = await Booking.find().lean().exec();
    let filteredBookings = bookings.filter(
      (booking) => booking.customerId.toString() == id
    );
    res.send(filteredBookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (for admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const bookings = await Booking.find();
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.fare || 0), 0);
    const upcomingBookings = await Booking.countDocuments({ status: 'upcoming' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    // Revenue by month (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= monthStart && bookingDate <= monthEnd;
      });
      
      const revenue = monthBookings.reduce((sum, booking) => sum + (booking.fare || 0), 0);
      monthlyRevenue.push({
        month: date.toLocaleString('default', { month: 'short' }),
        revenue,
        bookings: monthBookings.length
      });
    }
    
    res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Journey Status
exports.updateJourneyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { journeyStatus, journeyDate } = req.body;

    const validStatuses = ["UPCOMING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

    if (!validStatuses.includes(journeyStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey status",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update journey status
    booking.journeyStatus = journeyStatus;
    if (journeyDate) {
      booking.journeyDate = journeyDate;
    }
    await booking.save();

    // Trigger notifications based on journey status
    try {
      if (journeyStatus === "CANCELLED") {
        await NotificationService.sendBookingCancellation(
          booking.customerId,
          booking._id,
          "Your booking has been cancelled."
        );
      } else if (journeyStatus === "COMPLETED") {
        await NotificationService.createNotification({
          recipient: booking.customerId,
          type: "journey_reminder",
          title: "Journey Completed! 🌟",
          message: "Hope you had a great trip! Please take a moment to rate and review your journey.",
          data: { bookingId: booking._id, action: "review" }
        });
      }
    } catch (notifErr) {
      console.log("Error sending journey status notification:", notifErr);
    }

    res.json({
      success: true,
      message: "Journey status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
