const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hrms_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.message);
    return;
  }
  console.log("✅ MySQL Connected!");
});

// ✅ Employees with Department Name (JOIN)
app.get("/api/employees", (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.employee_id,
      e.employee_code,
      e.first_name,
      e.last_name,
      e.email,
      e.designation,
      e.department_id,
      e.salary,
      e.performance,
      e.status,
      e.phone_no,
      e.job_role,
      d.name AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Register New Employee
app.post("/api/register", (req, res) => {
  const { employeeId, name, email, department } = req.body;
  const sql = "INSERT INTO employees (employee_id, first_name, email, department_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [employeeId, name, email, department], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Registered Successfully!" });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});