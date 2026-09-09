const express = require("express");
const router = express.Router();
const savedRouteController = require("../controllers/savedRoute");

router.post("/v1/api/saved-routes", savedRouteController.createSavedRoute);
router.get("/v1/api/saved-routes/user/:userId", savedRouteController.getUserSavedRoutes);
router.get("/v1/api/saved-routes/:id", savedRouteController.getSavedRoute);
router.put("/v1/api/saved-routes/:id", savedRouteController.updateSavedRoute);
router.delete("/v1/api/saved-routes/:id", savedRouteController.deleteSavedRoute);

module.exports = router;
