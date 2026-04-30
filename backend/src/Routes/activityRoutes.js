const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware")

const router = express.Router();
const activityController = require("../Controllers/acitivityController");
const { route } = require("./authRoutes");


router.post("/bulk",authMiddleware, activityController.bulkInsert);

module.exports = router;
