const db = require("../config/db14");

const findByEmail = (email, callback) => {
  const sql = `
    SELECT e.*, d.name AS department
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.email = ?
    LIMIT 1
  `;
  db.query(sql, [email], callback);
};

const findById = (empId, callback) => {
  const sql = `
    SELECT e.*, d.name AS department
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.employee_id = ?
    LIMIT 1
  `;
  db.query(sql, [empId], callback);
};

const createEmployee = (data, callback) => {
  const { empId, name, designation, email, phone, password } = data;
  const sql = `
    INSERT INTO employees (employee_id, first_name, designation, email, phone_no, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [empId, name, designation, email, phone, password], callback);
};

const findAll = (callback) => {
  const sql = "SELECT employee_id, first_name, email, password FROM employees";
  db.query(sql, callback);
};

module.exports = { findByEmail, findById, createEmployee, findAll };