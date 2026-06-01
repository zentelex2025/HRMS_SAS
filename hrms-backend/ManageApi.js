const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());

const handleErr = (res, err, ctx) => {
  console.error(`[${ctx}]`, err.message);
  if (err.code === "ER_DUP_ENTRY") {
    if (err.message.includes("email"))
      return res.status(400).json({
        success: false,
        error: "This email is already registered!",
      });
    if (err.message.includes("employee_id"))
      return res
        .status(400)
        .json({ success: false, error: "This Employee ID already exists!" });
    return res.status(400).json({ success: false, error: "Duplicate entry!" });
  }
  res.status(500).json({ success: false, error: err.message });
};

// ── GET Employees ─────────────────────────────
// ── GET Employees ─────────────────────────────
app.get("/api/employees", (req, res) => {
  const sql = `
    SELECT
      e.id,
      e.employee_code,
      CONCAT(e.first_name, ' ', IFNULL(e.last_name,'')) AS name,
      e.designation,
      IFNULL(d.name, e.department) AS dept,
      e.email,
      e.phone_no,
      e.job_role,
      e.status,
      e.salary AS current_salary,
      e.reporting_manager,
      e.joining_date,
      e.kpi
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    ORDER BY e.id DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return handleErr(res, err, "GET_EMP");
    res.json({ success: true, data: rows });
  });
});

app.post("/api/employees/add", async (req, res) => {
  const d = req.body;

  try {
    if (!d.name || !d.employee_code)
      return res
        .status(400)
        .json({ success: false, error: "Name & Employee ID required" });

    const [existingId] = await db
      .promise()
      .query("SELECT id FROM employees WHERE employee_code = ?", [
        d.employee_code,
      ]);
    if (existingId.length > 0)
      return res.status(400).json({
        success: false,
        error: "This Employee ID already exists!",
      });

    const [existingEmail] = await db
      .promise()
      .query("SELECT id FROM employees WHERE email = ?", [d.email]);
    if (existingEmail.length > 0)
      return res
        .status(400)
        .json({ success: false, error: "This Email is already registered!" });

    const hash = await bcrypt.hash(d.password || "User@123", 10);
    const nameParts = (d.name || "").trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    let department_id = null;
    if (d.dept) {
      const [deptRows] = await db
        .promise()
        .query("SELECT id FROM departments WHERE name = ?", [d.dept]);
      if (deptRows.length > 0) department_id = deptRows[0].id;
    }

    // ✅ kpi column যোগ করা হয়েছে
    const sql = `
      INSERT INTO employees
      (employee_code, first_name, last_name, department, department_id, designation, email,
       job_role, status, password, salary, joining_date, reporting_manager, phone_no, kpi)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    await db.promise().query(sql, [
      d.employee_code,
      first_name,
      last_name,
      d.dept || null,
      department_id,
      d.designation || null,
      d.email || null,
      d.job_role || "employee",
      d.status || "Active",
      hash,
      d.current_salary || 0,
      d.joining_date || null,
      d.reporting_manager || null,
      d.phone_no || null,
      d.kpi || null, // ✅ নতুন
    ]);
    res.json({ success: true, message: "Employee added successfully!" });
  } catch (e) {
    handleErr(res, e, "ADD_EMP");
  }
});

app.post("/api/employees/update", async (req, res) => {
  const d = req.body;
  try {
    const [existingEmail] = await db
      .promise()
      .query(
        "SELECT id FROM employees WHERE email = ? AND employee_code != ?",
        [d.email, d.employee_code],
      );
    if (existingEmail.length > 0)
      return res
        .status(400)
        .json({ success: false, error: "This email is already registered!" });

    const nameParts = (d.name || "").trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    let department_id = null;
    if (d.dept) {
      const [deptRows] = await db
        .promise()
        .query("SELECT id FROM departments WHERE name = ?", [d.dept]);
      if (deptRows.length > 0) department_id = deptRows[0].id;
    }

    // ✅ kpi যোগ করা হয়েছে
    const sql = `
      UPDATE employees SET
        first_name=?, last_name=?, department=?, department_id=?,
        designation=?, email=?, job_role=?, status=?,
        salary=?, joining_date=?, reporting_manager=?,
        phone_no=?, kpi=?, updated_at=NOW()
      WHERE employee_code=?
    `;
    const [r] = await db.promise().query(sql, [
      first_name,
      last_name,
      d.dept || null,
      department_id,
      d.designation || null,
      d.email || null,
      d.job_role || "employee",
      d.status || "Active",
      d.current_salary || 0,
      d.joining_date || null,
      d.reporting_manager || null,
      d.phone_no || null,
      d.kpi || null, // ✅ নতুন
      d.employee_code,
    ]);

    if (r.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, error: "Employee not found." });
    res.json({ success: true, message: "Employee updated successfully!" });
  } catch (e) {
    handleErr(res, e, "UPDATE_EMP");
  }
});
// ── DELETE Employee ──────────────────────────
app.post("/api/employees/delete", async (req, res) => {
  const { employee_code } = req.body;
  try {
    await db
      .promise()
      .query("DELETE FROM employees WHERE employee_code = ?", [employee_code]);
    res.json({ success: true, message: "Deleted successfully." });
  } catch (e) {
    handleErr(res, e, "DELETE_EMP");
  }
});

// ── LOGIN ───────────────────────────────────
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password required." });

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM employees WHERE email = ?", [email]);
    if (rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    delete user.password;
    res.json({ success: true, message: "Login successful!", employee: user });
  } catch (e) {
    handleErr(res, e, "LOGIN");
  }
});

// ── GET Salary Structure ─────────────────────
app.get("/api/salary/:employee_code", async (req, res) => {
  const { employee_code } = req.params;
  try {
    const [emp] = await db.promise().query(
      `SELECT salary AS current_salary,
              CONCAT(first_name,' ',IFNULL(last_name,'')) AS name,
              designation, department_id
       FROM employees WHERE employee_code = ?`,
      [employee_code],
    );
    if (!emp.length)
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });

    const gross_salary = parseFloat(emp[0].current_salary) || 0;
    const basic = parseFloat((gross_salary * 0.5).toFixed(2));
    const hra = parseFloat((gross_salary * 0.2).toFixed(2));
    const conveyance = 2000;
    const medical = 1500;
    const special_allowance = Math.max(
      parseFloat(
        (gross_salary - basic - hra - conveyance - medical).toFixed(2),
      ),
      0,
    );
    const gross = parseFloat(
      (basic + hra + conveyance + medical + special_allowance).toFixed(2),
    );
    const pf = parseFloat((basic * 0.12).toFixed(2));
    const esi =
      gross_salary <= 21000 ? parseFloat((gross * 0.0075).toFixed(2)) : 0;
    const pt = 200;
    const tds = parseFloat((gross * 0.05).toFixed(2));
    const other = 500;
    const total_deductions = parseFloat(
      (pf + esi + pt + tds + other).toFixed(2),
    );
    const net_salary = parseFloat((gross - total_deductions).toFixed(2));

    res.json({
      success: true,
      employee: {
        name: emp[0].name,
        designation: emp[0].designation,
        employee_code,
      },
      salary: {
        earnings: { basic, hra, conveyance, medical, special_allowance },
        gross_salary: gross,
        deductions: { pf, esi, pt, tds, other },
        total_deductions,
        net_salary,
      },
    });
  } catch (e) {
    handleErr(res, e, "GET_SALARY");
  }
});

// ── START SERVER ───────────────────────────
app.listen(5002, () =>
  console.log("🚀 Server running on http://localhost:5002"),
);
