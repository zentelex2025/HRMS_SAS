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
    console.error("DB connection failed!", err.message);
    return;
  }
  console.log("MySQL connected!");
});

app.post("/api/login", (req, res) => {
  const { name, designation, empId, email, phone, password } = req.body;

  if (!name || !designation || !empId || !email || !phone) {
    return res.status(400).json({ message: "Sabhi fields required hain" });
  }

  const checkSql = "SELECT * FROM employees WHERE employee_id = ? OR email = ?";
  db.query(checkSql, [empId, email], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err.message });

    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Login successful",
        employee: {
          ...results[0],
          report_to: "HR Manager", // ✅ সবসময় HR Manager
        },
        token: "employee-session-" + empId,
      });
    }

    const insertSql = `
      INSERT INTO employees (employee_id, first_name, designation, email, phone_no)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [empId, name, designation, email, phone], (err, result) => {
      if (err)
        return res.status(500).json({ message: "Insert failed", error: err.message });

      return res.json({
        success: true,
        message: "Employee registered & logged in",
        employee: {
          id: result.insertId,
          employee_id: empId,
          first_name: name,
          designation,
          email,
          phone_no: phone,
          report_to: "HR Manager", // ✅ সবসময় HR Manager
        },
        token: "employee-session-" + empId,
      });
    });
  });
});

app.get("/api/employee/:empId", (req, res) => {
  const { empId } = req.params;

  const sql = "SELECT * FROM employees WHERE employee_id = ?";
  db.query(sql, [empId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Employee not found" });

    return res.json({
      success: true,
      employee: {
        ...results[0],
        report_to: "HR Manager", // ✅ সবসময় HR Manager
      },
    });
  });
});

app.listen(5014, () => {
  console.log("Server running on http://localhost:5014");
});