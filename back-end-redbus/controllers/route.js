const Route = require("../models/route");
const Bus = require("../models/bus");
const Booking = require("../models/booking");
exports.getAllRoutes = async (req, res) => {
  let routes = await Route.find().lean().exec();
  res.send(routes);
};

// get route,buses and available seats based on "Customer Search for:  "Departure,Arrival,Date"
exports.getOneRoute = async (req, res) => {
  let departure = req.params.departure;
  let arrival = req.params.arrival;
  let date = req.params.date;

  // get the relevant route
  let routes = await Route.find().lean().exec();
  let route = routes.find((route) => {
    return (
      route.departureLocation.name.toLowerCase() == departure.toLowerCase() &&
      route.arrivalLocation.name.toLowerCase() == arrival.toLowerCase()
    );
  });

  // Check if route exists
  if (!route) {
    return res.status(404).json({ message: "Route not found" });
  }

  // get all buses for that route
  let buses = await Bus.find();
  let matchedBuses = buses.filter((bus) => {
    // console.log(bus.routes, route._id, typeof route._id);
    return bus.routes.toString() === route._id.toString();
  });

  // get the seats booked for each matched buses
  const bookings = await Booking.find().lean().exec();
  const busIdWithSeatsObj = {};
  for (let i = 0; i < matchedBuses.length; i++) {
    let currentBusSeats = [];
    const busBookings = bookings.filter((booking) => {
      return (
        booking.departureDetails.date === date &&
        booking.busId.toString() === matchedBuses[i]._id.toString()
      );
    });
    busBookings.forEach((booking) => {
      currentBusSeats = [...currentBusSeats, ...booking.seats];
    });
    busIdWithSeatsObj[matchedBuses[i]._id.toString()] = currentBusSeats;
  }
  res.send({ route: route, matchedBuses: matchedBuses, busIdWithSeatsObj });
};

// Create new route (Admin)
exports.createRoute = async (req, res) => {
  try {
    const { departureLocation, arrivalLocation, duration } = req.body;
    const newRoute = await Route.create({
      departureLocation: typeof departureLocation === 'string' ? { name: departureLocation } : departureLocation,
      arrivalLocation: typeof arrivalLocation === 'string' ? { name: arrivalLocation } : arrivalLocation,
      duration: Number(duration) || 180
    });
    res.status(201).json({ success: true, route: newRoute });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete route (Admin)
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }
    res.json({ success: true, message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
