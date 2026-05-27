const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  const query = `
    SELECT 
      e.id,
      e.employee_id,
      e.employee_code,
      e.first_name,
      e.last_name,
      e.email,
      e.designation,
      e.department_id,
      d.name AS department_name,
      e.salary,
      e.performance,
      e.status
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: results });
  });
});

module.exports = router;