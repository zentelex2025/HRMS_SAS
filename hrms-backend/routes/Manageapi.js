const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employeeController");

// ── ১. সকল Employee দেখা ──
router.get("/employees", EmployeeController.getAll);

// ── ২. Login ──
router.post("/login", EmployeeController.login);

// ── ৩. নতুন Employee যোগ করা ──
router.post("/register", EmployeeController.register);

// ── ৪. Password Change ──
router.put("/change-password", EmployeeController.changePassword);

// ── ৫. Employee Delete ──
router.delete("/employees/:id", EmployeeController.deleteEmployee);

// ── ৬. Employee Update ──
router.put("/employees/:id", EmployeeController.updateEmployee);

module.exports = router;
