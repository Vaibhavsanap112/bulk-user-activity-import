const express = require("express")
const router = express.Router();
const importController = require("../Controllers/importController");

router.post("/start", importController.startImport);
router.get("/status/:id", importController.getStatus);


module.exports = router;
