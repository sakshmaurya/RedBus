const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");

router.post("/v1/api/customers", customerController.addNewCustomer);
router.get("/v1/api/customers/all", customerController.getAllUsers);
router.get("/v1/api/customers/stats", customerController.getUserStats);
router.patch("/v1/api/customers/:userId/verify", customerController.toggleUserVerification);
router.delete("/v1/api/customers/:userId", customerController.deleteUser);
router.put("/v1/api/customers/:userId/preferences", customerController.updateUserPreferences);
router.get("/v1/api/customers/:userId/preferences", customerController.getUserPreferences);

module.exports = router;
