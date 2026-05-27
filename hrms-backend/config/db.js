// config/db.js
// সব controllers এই file থেকে db import করবে

const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: '',
  database: 'hrms_db',

});

db.connect(err => {
  if (err) { console.error("❌ DB Error:", err.message); return; }
  console.log("✅ MySQL Connected");

  // ── Auto-add missing columns to employees ──────────────
  const empCols = [
    "current_salary DECIMAL(10,2) DEFAULT 0",
    "job_role VARCHAR(50) DEFAULT 'employee'",
    "phone_no VARCHAR(20) DEFAULT NULL",
    "emergency_contact VARCHAR(20) DEFAULT NULL",
    "father_name VARCHAR(100) DEFAULT NULL",
    "mother_name VARCHAR(100) DEFAULT NULL",
    "permanent_address TEXT DEFAULT NULL",
    "pan_number VARCHAR(20) DEFAULT NULL",
    "aadhaar_number VARCHAR(20) DEFAULT NULL",
    "marital_status VARCHAR(20) DEFAULT NULL",
    "highest_qual VARCHAR(100) DEFAULT NULL",
    "edu_10th VARCHAR(10) DEFAULT NULL",
    "edu_10th_marks VARCHAR(50) DEFAULT NULL",
    "edu_10th_board VARCHAR(100) DEFAULT NULL",
    "edu_12th VARCHAR(10) DEFAULT NULL",
    "edu_12th_marks VARCHAR(50) DEFAULT NULL",
    "edu_12th_board VARCHAR(100) DEFAULT NULL",
    "edu_grad VARCHAR(100) DEFAULT NULL",
    "edu_pg VARCHAR(100) DEFAULT NULL",
    "extra_curricular TEXT DEFAULT NULL",
    "must_change_password TINYINT(1) DEFAULT 1",
    "photo VARCHAR(255) DEFAULT NULL",
    "pan_card_doc VARCHAR(255) DEFAULT NULL",
    "aadhaar_doc VARCHAR(255) DEFAULT NULL",
    "last_salary_slip VARCHAR(255) DEFAULT NULL",
    "offer_letter VARCHAR(255) DEFAULT NULL",
    "certificate VARCHAR(255) DEFAULT NULL",
    "result_10th VARCHAR(255) DEFAULT NULL",
    "result_12th VARCHAR(255) DEFAULT NULL",
  ];
  empCols.forEach(colDef => {
    db.query(`ALTER TABLE employees ADD COLUMN IF NOT EXISTS ${colDef}`,
      (e) => { if (e && e.code !== 'ER_DUP_FIELDNAME') console.error(colDef.split(' ')[0], e.message); }
    );
  });

  // ── Auto-create increment tables ───────────────────────
  db.query(`CREATE TABLE IF NOT EXISTS increment_requests (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    employee_code  VARCHAR(50),
    increment_type VARCHAR(20),
    increment_value DECIMAL(10,2),
    old_salary     DECIMAL(10,2),
    new_salary     DECIMAL(10,2),
    remarks        TEXT,
    requested_by   VARCHAR(100),
    status         VARCHAR(20) DEFAULT 'Pending',
    approved_by    VARCHAR(100),
    approved_at    DATETIME,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (e) => { if (e) console.error("increment_requests:", e.message); });

  db.query(`CREATE TABLE IF NOT EXISTS salary_increment_history (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    employee_code  VARCHAR(50),
    old_salary     DECIMAL(10,2),
    increment_type VARCHAR(20),
    increment_value DECIMAL(10,2),
    new_salary     DECIMAL(10,2),
    remarks        TEXT,
    approved_by    VARCHAR(100),
    approved_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (e) => { if (e) console.error("salary_increment_history:", e.message); });
});

module.exports = db;