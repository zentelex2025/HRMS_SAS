// ================================================================
//  routes/employeeRoutes.js — All API Routes
// ================================================================

const express = require("express");
const router = express.Router();
const uploadFields = require("./middleware/uploads");
const {
  getAllEmployees,
  loginEmployee,
  registerEmployee,
  changePassword,
  deleteEmployee,
} = require("../controllers/employeeController2");


// GET    /api/employees        — সব employee list
router.get("/employees", getAllEmployees);

// POST   /api/login            — login
router.post("/login", loginEmployee);

// POST   /api/register         — নতুন employee register (documents সহ)
router.post("/register", uploadFields, registerEmployee);

// PUT    /api/change-password  — password change
router.put("/change-password", changePassword);

// DELETE /api/employees/:id    — employee delete
router.delete("/employees/:id", deleteEmployee);

module.exports = router;