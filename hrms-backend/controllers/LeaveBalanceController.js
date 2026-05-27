const db = require("../config/db");

// GET all balances
exports.getAllBalances = (req, res) => {
  db.query(
    "SELECT * FROM leave_balance ORDER BY employee_code, leave_code",
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// GET by employee_code
exports.getBalanceByEmployee = (req, res) => {
  db.query(
    "SELECT * FROM leave_balance WHERE employee_code = ? AND year = 2026",
    [req.params.employee_code],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// PATCH — update availed
exports.updateBalance = (req, res) => {
  const { employee_code, leave_code, availed } = req.body;
  db.query(
    `UPDATE leave_balance SET availed = ?
     WHERE employee_code = ? AND leave_code = ? AND year = 2026`,
    [availed, employee_code, leave_code],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Leave balance updated" });
    }
  );
};

// POST — add new employee balance
exports.addBalance = (req, res) => {
  const { employee_code, employee_name, leave_code, leave_type, opening, accrued, availed, year } = req.body;
  db.query(`
    INSERT INTO leave_balance
    (employee_code, employee_name, leave_code, leave_type, opening, accrued, availed, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    employee_code, employee_name, leave_code, leave_type,
    opening || 0, accrued || 0, availed || 0, year || 2026,
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Leave balance added", id: result.insertId });
  });
};