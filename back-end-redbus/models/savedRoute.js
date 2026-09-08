const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedRouteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Customers",
    required: true
  },
  routeName: {
    type: String,
    required: true
  },
  startLocation: {
    name: String,
    lat: Number,
    lng: Number
  },
  destination: {
    name: String,
    lat: Number,
    lng: Number
  },
  waypoints: [{
    name: String,
    lat: Number,
    lng: Number
  }],
  distance: {
    type: Number,
    required: false
  },
  duration: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedRoutes", savedRouteSchema);
