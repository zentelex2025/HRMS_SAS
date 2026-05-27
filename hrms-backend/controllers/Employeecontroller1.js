// controllers/employeeController.js
// ── Business Logic এখানে থাকবে ─────────────────────────────

const bcrypt          = require('bcryptjs');
const employeeModel   = require('../Models/employeeModel2');

// GET — সব employee
const getEmployees = (req, res) => {
  employeeModel.getAllEmployees((err, rows) => {
    if (err) {
      console.error('[GET_EMP]', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
};

// POST — নতুন employee add
const addEmployee = async (req, res) => {
  const d = req.body;

  // Validation
  if (!d.name || !d.employee_code) {
    return res.status(400).json({ success: false, error: "Name & Employee ID required" });
  }

  try {
    // Duplicate check
    const existing = await new Promise((resolve, reject) =>
      employeeModel.findByEmployeeCode(d.employee_code, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: "Employee ID already exists!" });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(d.password || 'Admin@123', 10);

    // DB insert
    employeeModel.createEmployee(d, hashedPassword, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, error: "Employee ID already exists!" });
        }
        console.error('[ADD_EMP]', err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "Employee added successfully!" });
    });

  } catch (e) {
    console.error('[ADD_EMP]', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
};

// POST — employee update
const updateEmployee = (req, res) => {
  const d = req.body;
  employeeModel.updateEmployee(d, (err, result) => {
    if (err) {
      console.error('[UPDATE_EMP]', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Employee not found." });
    }
    res.json({ success: true, message: "Employee updated successfully!" });
  });
};

// POST — employee delete
const deleteEmployee = (req, res) => {
  const { employee_code } = req.body;
  employeeModel.deleteEmployee(employee_code, (err) => {
    if (err) {
      console.error('[DELETE_EMP]', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: "Deleted successfully." });
  });
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};