const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");



// User Create Report

router.post(
    "/v1/api/report",
    reportController.createReport
);





// Admin Get All Reports

router.get(
    "/v1/api/reports",
    reportController.getAllReports
);






// Admin Delete All Reports (cleanup)

router.delete(
    "/v1/api/reports",
    reportController.deleteAllReports
);






// Admin Update Report Status

router.patch(
    "/v1/api/reports/:id",
    reportController.updateReportStatus
);





module.exports = router;