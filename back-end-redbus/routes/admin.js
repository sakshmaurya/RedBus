const express = require("express");

const router = express.Router();


const adminController = require("../controllers/adminController");




// Admin Dashboard Stats

router.get(

"/v1/api/admin/stats",

adminController.getDashboardStats

);



module.exports = router;