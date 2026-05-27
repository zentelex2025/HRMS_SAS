const express = require("express");
const router = express.Router();

// এখানে ../controllers/PayloadController দিতে হবে
const { getPayrollData, savePayrollData } = require("../../../controllers/payrollController");

// রাউটগুলো ডিফাইন করা হলো
router.get("/:empId", getPayrollData);
router.post("/save", savePayrollData);

module.exports = router;