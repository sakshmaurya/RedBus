const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const busSchema = new Schema({
  operatorName: {
    type: String,
    required: true,
  },
  busType: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  rating: {
    type: [Number],
    default: [4.5],
  },
  // fare is manual
  totalSeats: {
    type: Number,
    default: 40,
  },
  routes: {
    type: Schema.Types.ObjectId,
    ref: "Routes",
    required: true,
  },
  images: {
    type: String,
    default: "https://st.redbus.in/Images/rdc/rdc-redbus-logo.svg",
  },
  liveTracking: {
    type: Number,
    default: 1,
  },
  reschedulable: {
    type: Number,
    default: 1,
  },
  // Bus stops for route
  stops: [{
    name: String,
    time: String,
    sequence: Number
  }],
  // Fare per seat
  fare: {
    type: Number,
    required: false,
  },
  // Bus status
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  // Amenities
  amenities: [String],
  // Bus number
  busNumber: String
});

module.exports = mongoose.model("Buses", busSchema);
