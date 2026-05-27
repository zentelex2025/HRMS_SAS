// routes/departmentRoutes.js
const express               = require("express");
const router                = express.Router();
const departmentController  = require("../controllers/DepartmentController");

router.get("/", departmentController.getDepartments); // GET /api/departments

module.exports = router;