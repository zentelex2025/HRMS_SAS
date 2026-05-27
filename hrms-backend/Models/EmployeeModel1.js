const db = require("../config/db");

// Get All Employees - Department name সহ
exports.getAllEmployees = (callback) => {
  const query = `
    SELECT 
      e.id,
      e.employee_id,
      e.employee_code,
      e.first_name,
      e.last_name,
      e.email,
      e.designation,
      e.department_id,
      d.name AS department_name,
      e.salary,
      e.performance,
      e.status,
      e.created_at,
      e.updated_at
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

// Register Employee
exports.registerEmployee = (data, callback) => {
  const query = `
    INSERT INTO employees 
    (employee_id, employee_code, first_name, last_name, email, designation, department_id, salary, performance, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.employee_id,
    data.employee_code,
    data.first_name,
    data.last_name,
    data.email,
    data.designation,
    data.department_id,
    data.salary,
    data.performance,
    data.status || "Active",
  ];
  db.query(query, values, callback);
};

// Get Single Employee
exports.getEmployeeById = (id, callback) => {
  const query = `
    SELECT 
      e.id,
      e.employee_id,
      e.employee_code,
      e.first_name,
      e.last_name,
      e.email,
      e.designation,
      e.department_id,
      d.name AS department_name,
      e.salary,
      e.performance,
      e.status
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `;
  db.query(query, [id], (err, results) => {
    callback(err, results[0]);
  });
};

// Update Employee
exports.updateEmployee = (id, data, callback) => {
  const query = `
    UPDATE employees SET
    first_name=?, last_name=?, email=?, designation=?,
    department_id=?, salary=?, performance=?, status=?, updated_at=NOW()
    WHERE id=?
  `;
  const values = [
    data.first_name,
    data.last_name,
    data.email,
    data.designation,
    data.department_id,
    data.salary,
    data.performance,
    data.status,
    id,
  ];
  db.query(query, values, callback);
};

// Delete Employee
exports.deleteEmployee = (id, callback) => {
  db.query("DELETE FROM employees WHERE id = ?", [id], callback);
};