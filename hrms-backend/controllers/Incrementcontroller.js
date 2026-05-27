// controllers/incrementController.js
const db = require('../config/db');

const handleErr = (res, err, ctx) => {
  console.error(`[${ctx}]`, err.message);
  res.status(500).json({ success: false, error: err.message });
};

// POST /api/increment/apply  ← Admin/HR directly apply
exports.apply = async (req, res) => {
  const { employee_code, increment_type, increment_value, remarks, approved_by } = req.body;
  try {
    const [emp] = await db.promise().query(
      `SELECT current_salary FROM employees WHERE employee_code=?`, [employee_code]
    );
    if (!emp.length)
      return res.status(404).json({ success: false, error: "Employee not found" });

    const old_salary = parseFloat(emp[0].current_salary) || 0;
    const val        = parseFloat(increment_value) || 0;
    const new_salary = increment_type === 'percent'
      ? old_salary + (old_salary * val / 100)
      : old_salary + val;

    await db.promise().query(
      `UPDATE employees SET current_salary=? WHERE employee_code=?`,
      [new_salary.toFixed(2), employee_code]
    );
    await db.promise().query(
      `INSERT INTO salary_increment_history
        (employee_code, old_salary, increment_type, increment_value, new_salary, remarks, approved_by)
       VALUES (?,?,?,?,?,?,?)`,
      [employee_code, old_salary, increment_type, val,
       new_salary.toFixed(2), remarks || '', approved_by || 'Admin']
    );

    res.json({ success: true, old_salary: old_salary.toFixed(2), new_salary: new_salary.toFixed(2) });
  } catch (e) { handleErr(res, e, 'INC_APPLY'); }
};

// POST /api/increment/request  ← Manager request পাঠাবে
exports.request = async (req, res) => {
  const { employee_code, increment_type, increment_value, remarks, requested_by } = req.body;
  try {
    const [emp] = await db.promise().query(
      `SELECT current_salary FROM employees WHERE employee_code=?`, [employee_code]
    );
    if (!emp.length)
      return res.status(404).json({ success: false, error: "Employee not found" });

    const old_salary = parseFloat(emp[0].current_salary) || 0;
    const val        = parseFloat(increment_value) || 0;
    const new_salary = increment_type === 'percent'
      ? old_salary + (old_salary * val / 100)
      : old_salary + val;

    await db.promise().query(
      `INSERT INTO increment_requests
        (employee_code, increment_type, increment_value, old_salary, new_salary, remarks, requested_by, status)
       VALUES (?,?,?,?,?,?,?,'Pending')`,
      [employee_code, increment_type, val, old_salary,
       new_salary.toFixed(2), remarks || '', requested_by || 'Manager']
    );

    res.json({ success: true, message: "Increment request submitted!" });
  } catch (e) { handleErr(res, e, 'INC_REQUEST'); }
};

// GET /api/increment/requests/pending  ← Admin/HR দেখবে
exports.getPending = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT ir.*, e.name, e.dept, e.designation
       FROM increment_requests ir
       JOIN employees e ON ir.employee_code = e.employee_code
       WHERE ir.status = 'Pending'
       ORDER BY ir.created_at DESC`
    );
    res.json({ success: true, requests: rows });
  } catch (e) { handleErr(res, e, 'PENDING_INC'); }
};

// PUT /api/increment/request/:id/status  ← Admin/HR approve/reject
exports.updateStatus = async (req, res) => {
  const { id }                  = req.params;
  const { status, approved_by } = req.body;

  if (!['Approved', 'Rejected'].includes(status))
    return res.status(400).json({ success: false, error: "Invalid status" });

  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM increment_requests WHERE id=?`, [id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, error: "Request not found" });

    const r = rows[0];

    if (status === 'Approved') {
      await db.promise().query(
        `UPDATE employees SET current_salary=? WHERE employee_code=?`,
        [r.new_salary, r.employee_code]
      );
      await db.promise().query(
        `INSERT INTO salary_increment_history
          (employee_code, old_salary, increment_type, increment_value, new_salary, remarks, approved_by)
         VALUES (?,?,?,?,?,?,?)`,
        [r.employee_code, r.old_salary, r.increment_type,
         r.increment_value, r.new_salary, r.remarks, approved_by || 'Admin']
      );
    }

    await db.promise().query(
      `UPDATE increment_requests SET status=?, approved_by=?, approved_at=NOW() WHERE id=?`,
      [status, approved_by || 'Admin', id]
    );

    res.json({
      success:    true,
      message:    `Increment ${status}`,
      new_salary: status === 'Approved' ? r.new_salary : null
    });
  } catch (e) { handleErr(res, e, 'INC_APPROVE'); }
};

// GET /api/increment/history/:employee_code
exports.getHistory = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM salary_increment_history
       WHERE employee_code=? ORDER BY approved_at DESC`,
      [req.params.employee_code]
    );
    res.json({ success: true, history: rows });
  } catch (e) { handleErr(res, e, 'INC_HISTORY'); }
};