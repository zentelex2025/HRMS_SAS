const db = require("../config/db");

// ✅ AI Calculation Engine
const calculatePayroll = (data) => {
  const basic = Number(data.basic);
  const hra = Number(data.hra);
  const conveyance = Number(data.conveyance);
  const medical = Number(data.medical);
  const special = Number(data.special);

  const gross = basic + hra + conveyance + medical + special;

  const pf = Math.round(basic * 0.12);
  const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;

  const totalDeductions =
    pf + esi + Number(data.pt) + Number(data.tds) + Number(data.others);

  const netSalary = gross - totalDeductions;

  return { gross, pf, esi, totalDeductions, netSalary };
};

// ✅ GET employee salary structure
const getPayroll = (req, res) => {
  const empId = req.params.empId;

  db.query("SELECT * FROM salary_details WHERE employee_id = ?", [empId], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (result.length > 0) {
      res.json({
        success: true,
        employeeName: result[0].employee_name,
        salaryStructure: result[0]
      });
    } else {
      res.status(404).json({ success: false });
    }
  });
};

// ✅ SAVE payroll
const savePayroll = (req, res) => {
  const d = req.body;
  const calc = calculatePayroll(d);

  const sql = `
    INSERT INTO employee_salary
    (employee_id, employee_name, basic, hra, conveyance, medical, special_allowance,
     gross_salary, pf, esi, pt, tds, other_deductions, total_deductions, net_salary, month_year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    d.employee_id,
    d.employee_name,
    d.basic,
    d.hra,
    d.conveyance,
    d.medical,
    d.special,
    calc.gross,
    calc.pf,
    calc.esi,
    d.pt,
    d.tds,
    d.others,
    calc.totalDeductions,
    calc.netSalary,
    d.month_year
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({ success: true, data: calc });
  });
};

// ✅ HISTORY
const getHistory = (req, res) => {
  const empId = req.params.empId;

  db.query(
    "SELECT * FROM employee_salary WHERE employee_id = ? ORDER BY created_at DESC",
    [empId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false });

      res.json({ success: true, data: result });
    }
  );
};

// ✅ UPDATE employee name
const updateName = (req, res) => {
  const { empId } = req.params;
  const { employee_name } = req.body;

  if (!employee_name || employee_name.trim() === "") {
    return res.status(400).json({ success: false, message: "Name cannot be empty" });
  }

  db.query(
    "UPDATE salary_details SET employee_name = ? WHERE employee_id = ?",
    [employee_name.trim(), empId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }

      res.json({ success: true, message: "Name updated successfully" });
    }
  );
};

module.exports = { getPayroll, savePayroll, getHistory, updateName };