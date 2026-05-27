const mysql = require("mysql2");
const express = require("express");
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // your MySQL username
    password: "",       // your MySQL password
    database: "hrms"    // must match the database you just created
});

// Test connection
db.connect(err => {
    if (err) {
        console.error("MySQL connection error:", err);
    } else {
        console.log("MySQL connected successfully!");
    }
});

// API to fetch employees
app.get("/api/employees", (req, res) => {
    const sql = `
        SELECT 
            e.employee_id,
            e.employee_code,
            e.first_name,
            e.last_name,
            e.email,
            e.status,
            e.performance,
            e.joining_date,
            d.department_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.department_id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(5000, () => {
    console.log("Backend Server running on port 5000");
});