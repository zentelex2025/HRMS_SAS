// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
// ✅ সঠিক
const employeeController = require("../controllers/employeeController");

router.get("/", employeeController.getEmployees); // GET  /api/employees
router.get("/:id", employeeController.getEmployeeById); // GET  /api/employees/:id
router.post("/", employeeController.addEmployee); // POST /api/employees
router.put("/:id", employeeController.updateEmployee); // PUT  /api/employees/:id
router.delete("/:id", employeeController.deleteEmployee); // DELETE /api/employees/:id

module.exports = router;
