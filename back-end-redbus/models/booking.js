const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  passengerDetails: [
    {
      name: { type: String, required: true },
      gender: { type: String, required: true },
      age: { type: Number, required: true },
    },
  ],
  email: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  fare: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  // Journey status for review eligibility
  journeyStatus: {
    type: String,
    enum: ["UPCOMING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    default: "UPCOMING",
  },
  // Journey date for completion tracking
  journeyDate: {
    type: String,
    required: false,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  busId: {
    type: Schema.Types.ObjectId,
    ref: "Buses",
    required: true,
  },
  seats: {
    type: [Number],
    required: true,
  },
  departureDetails: {
    city: { type: String, required: false },
    location: { type: String, required: false },
    time: { type: Number, required: false },
    date: { type: String, required: false },
  },
  arrivalDetails: {
    city: { type: String, required: false },
    location: { type: String, required: false },
    time: { type: String, required: false },
    date: { type: String, required: false },
  },
  duration: {
    type: String,
    required: true,
  },
  isBusinessTravel: {
    type: Boolean,
    required: false,
  },
  businessDetails: {
    gst: { type: String, required: false },
    name: { type: String, required: false },
    address: { type: String, required: false },
    email: { type: String, required: false },
  },
  isInsurance: {
    type: Boolean,
    required: false,
  },
  isCovidDonated: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("Bookings", bookingSchema);
