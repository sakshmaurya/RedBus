const Bus = require("../models/bus");
const Booking = require("../models/booking");

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json({
      success: true,
      buses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }
    res.json({
      success: true,
      bus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create bus
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({
      success: true,
      bus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }
    res.json({
      success: true,
      bus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }
    res.json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get bus statistics (bookings, empty seats, etc.)
exports.getBusStats = async (req, res) => {
  try {
    const buses = await Bus.find();
    const bookings = await Booking.find();
    
    const busStats = buses.map(bus => {
      const busBookings = bookings.filter(booking => 
        booking.busId && booking.busId.toString() === bus._id.toString()
      );
      
      const totalBookings = busBookings.length;
      const bookedSeats = busBookings.reduce((acc, booking) => {
        return acc + (booking.seats ? booking.seats.length : 0);
      }, 0);
      
      const totalSeats = bus.totalSeats || 40;
      const emptySeats = totalSeats - bookedSeats;
      const occupancyRate = totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(1) : 0;
      
      return {
        busId: bus._id,
        operatorName: bus.operatorName,
        busNumber: bus.busNumber || 'N/A',
        busType: bus.busType,
        totalSeats,
        bookedSeats,
        emptySeats,
        totalBookings,
        occupancyRate,
        status: bus.status,
        stops: bus.stops || [],
        fare: bus.fare || 0
      };
    });
    
    res.json({
      success: true,
      busStats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};