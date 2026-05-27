const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5007;

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
    console.error("❌ MySQL Connection Failed: ", err.message);
    return;
  }
  console.log("✅ MySQL Connected Successfully to hrms_db!");
});

app.get("/api/payroll/:id", (req, res) => {
  const employeeId = req.params.id;
  const sqlQuery =
    "SELECT * FROM salary_details WHERE employee_name = 'Tonuja Dey Sarkar' LIMIT 1";

  db.query(sqlQuery, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });

    if (result.length > 0) {
      res.json({
        success: true,
        employeeName: result[0].employee_name,
        salaryStructure: result[0], // এখানে ডাটাবেসের সব কলাম থাকবে
      });
    } else {
      res.json({ success: false, message: "No data found" });
    }
  });
});
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("✅ HR Portal API running");
});

// ২. ডাটা সেভ করার API (POST)
app.post("/api/payroll/save", (req, res) => {
  const data = req.body;
  const sqlInsert = `INSERT INTO employee_salary 
    (employee_id, employee_name, basic, hra, conveyance, medical, special_allowance, gross_salary, pf, esi, pt, tds, other_deductions, total_deductions, net_salary, month_year) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    data.employee_id,
    data.employee_name,
    data.basic,
    data.hra,
    data.conveyance,
    data.medical,
    data.special,
    data.gross_salary,
    data.pf,
    data.esi,
    data.pt,
    data.tds,
    data.others,
    data.total_deductions,
    data.net_salary,
    data.month_year,
  ];

  db.query(sqlInsert, values, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Saved Successfully!" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
