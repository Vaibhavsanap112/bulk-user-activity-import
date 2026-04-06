const express = require("express");

const router = express.Router();
const activityController = require("../Controllers/acitivityController");
const { route } = require("./authRoutes");


router.post("/bulk", activityController.bulkInsert);

module.exports = router;
