const express = require("express");
const router = express.Router();
const { getPayroll, savePayroll, getHistory, updateName } = require("../controllers/payrollController");

router.get("/:empId", getPayroll);
router.post("/save", savePayroll);
router.get("/history/:empId", getHistory);
router.patch("/update-name/:empId", updateName);

module.exports = router;