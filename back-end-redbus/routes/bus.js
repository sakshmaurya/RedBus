const express = require("express");
const router = express.Router();
const busController = require("../controllers/bus");

// Get all buses
router.get("/", busController.getAllBuses);
router.get("/v1/api/buses", busController.getAllBuses);

// Get bus statistics
router.get("/stats/all", busController.getBusStats);
router.get("/v1/api/buses/stats", busController.getBusStats);

// Get bus by ID
router.get("/:id", busController.getBusById);
router.get("/v1/api/buses/:id", busController.getBusById);

// Create bus
router.post("/", busController.createBus);
router.post("/v1/api/buses", busController.createBus);

// Update bus
router.put("/:id", busController.updateBus);
router.put("/v1/api/buses/:id", busController.updateBus);

// Delete bus
router.delete("/:id", busController.deleteBus);
router.delete("/v1/api/buses/:id", busController.deleteBus);

module.exports = router;
