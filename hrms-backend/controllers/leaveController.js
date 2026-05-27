const db = require('../config/db');

// GET all leaves
exports.getAllLeaves = (req, res) => {
  db.query(
    'SELECT * FROM leaves ORDER BY created_at DESC',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// APPLY leave
exports.applyLeave = (req, res) => {
  const { employeeName, leaveType, fromDate, toDate, totalDays, reason } = req.body;

  if (!employeeName || !leaveType || !fromDate || !toDate || !totalDays)
    return res.status(400).send("All fields required!");

  const sql = `
    INSERT INTO leaves (employee_name, leave_type, from_date, to_date, total_days, reason, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending')
  `;
  db.query(sql, [employeeName, leaveType, fromDate, toDate, totalDays, reason || ''],
    (err) => {
      if (err) return res.status(500).send("Error: " + err.message);
      res.send("Leave applied successfully!");
    }
  );
};

// UPDATE leave status
exports.updateLeaveStatus = (req, res) => {
  const { id, status } = req.body;
  db.query(
    'UPDATE leaves SET status=? WHERE id=?',
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: `Status updated to ${status}` });
    }
  );
};

// DELETE leave
exports.deleteLeave = (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM leaves WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ success: false, error: "Leave not found." });
      res.json({ success: true, message: "Deleted successfully." });
    }
  );
};