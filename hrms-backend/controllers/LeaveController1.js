const db   = require("../config/db");
const path = require("path");
const fs   = require("fs");

// GET all leaves
exports.getAllLeaves = (req, res) => {
  db.query("SELECT * FROM leaves ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// POST — apply leave
exports.applyLeave = (req, res) => {
  const {
    employee_name, employee_code, department,
    leave_code, leave_type, from_date, to_date,
    total_days, reason, lop_days,
    doc_filename, doc_path,
    monthly_salary,
  } = req.body;

  const sql = `
    INSERT INTO leaves
    (employee_name, employee_code, department, leave_code, leave_type,
     from_date, to_date, total_days, reason, lop_days, doc_filename, doc_path, monthly_salary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const empCode = employee_code || "EMP001";

  db.query(sql, [
    employee_name, empCode, department || "Engineering",
    leave_code, leave_type, from_date, to_date,
    total_days, reason, lop_days || 0,
    doc_filename || null, doc_path || null, monthly_salary || 0,
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // ── Auto-create balance row if employee doesn't exist ──
    const defaultPolicies = [
      { code: "CL", type: "Casual Leave",  opening: 12 },
      { code: "SL", type: "Sick Leave",    opening: 10 },
      { code: "EL", type: "Earned Leave",  opening: 18 },
    ];

    db.query(
      "SELECT COUNT(*) AS cnt FROM leave_balance WHERE employee_code = ? AND year = 2026",
      [empCode],
      (err, rows) => {
        if (!err && rows[0].cnt === 0) {
          // New employee — insert all 3 leave types
          const values = defaultPolicies.map(p =>
            [empCode, employee_name, p.code, p.type, p.opening, 0, 0, 2026]
          );
          db.query(
            `INSERT INTO leave_balance
             (employee_code, employee_name, leave_code, leave_type, opening, accrued, availed, year)
             VALUES ?`,
            [values],
            (err) => { if (err) console.log("Auto balance create error:", err); }
          );
        }

        // ── Update availed for paid leaves ──
        if (!lop_days || lop_days === 0) {
          db.query(
            `UPDATE leave_balance SET availed = availed + ?
             WHERE employee_code = ? AND leave_code = ? AND year = 2026`,
            [total_days, empCode, leave_code],
            (err) => { if (err) console.log("Balance update error:", err); }
          );
        }
      }
    );

    res.json({ message: "Leave applied successfully", id: result.insertId });
  });
};

// PATCH — update status
exports.updateLeaveStatus = (req, res) => {
  const { status } = req.body;
  db.query(
    "UPDATE leaves SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `Status updated to ${status}` });
    }
  );
};

// DELETE — remove leave + file
exports.deleteLeave = (req, res) => {
  db.query("SELECT doc_filename FROM leaves WHERE id = ?", [req.params.id], (err, rows) => {
    if (!err && rows[0]?.doc_filename) {
      const filePath = path.join(__dirname, "../uploads", rows[0].doc_filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    db.query("DELETE FROM leaves WHERE id = ?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Leave deleted successfully" });
    });
  });
};