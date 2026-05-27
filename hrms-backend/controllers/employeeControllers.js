// controllers/employeeController.js
const employeeModel = require("../Models/employeeModel2");

const getEmployees = (req, res) => {
  employeeModel.getAll((err, results) => {
    if (err) {
      console.error("❌ Query error:", err.message);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    res.json(results);
  });
};

const getEmployeeById = (req, res) => {
  employeeModel.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json(results[0]);
  });
};

const addEmployee = (req, res) => {
  const {
    employee_id, employee_code, first_name, last_name,
    email, designation, department_id, salary, performance, status,
  } = req.body;

  const values = [
    employee_id, employee_code, first_name, last_name, email,
    designation, department_id || null, salary || null,
    performance || null, status || "Active",
  ];

  employeeModel.create(values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "✅ Employee added", id: result.insertId });
  });
};

const updateEmployee = (req, res) => {
  const {
    first_name, last_name, email, designation,
    department_id, salary, performance, status,
  } = req.body;

  const values = [
    first_name, last_name, email, designation,
    department_id || null, salary || null,
    performance || null, status || "Active",
    req.params.id,
  ];

  employeeModel.update(values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Employee updated" });
  });
};

const deleteEmployee = (req, res) => {
  employeeModel.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Employee deleted" });
  });
};

module.exports = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};