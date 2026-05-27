const express = require("express");
const router = express.Router();
const { login, getEmployeeById, getAllEmployees } = require("../controllers/authController");

router.post("/login", login);
router.get("/employee/:empId", getEmployeeById);
router.get("/employees/all", getAllEmployees); // debug route

module.exports = router;