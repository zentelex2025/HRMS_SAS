// routes/statsRoutes.js
const express         = require("express");
const router          = express.Router();
const statsController = require("../controllers/StatusController");

router.get("/", statsController.getStats); // GET /api/stats

module.exports = router;