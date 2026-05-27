const db = require("../config/db");

// Register Employee
exports.registerEmployee = (data, callback) => {
  const sql = `INSERT INTO employees 
    (employee_id, name, designation, department, email, password, mobile, adhaar, pan) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    data.employeeId,
    data.name,
    data.designation,
    data.department,
    data.email,
    data.password,
    data.mobileNo,
    data.adharNo,
    data.panNo
  ];

  db.query(sql, values, callback);
};

// Get Employees
exports.getAllEmployees = (callback) => {
  db.query("SELECT * FROM employees ORDER BY id DESC", callback);
};