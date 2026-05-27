const mysql = require("mysql2");

const db = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "hrms_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL connected to hrms_db");

  // role column না থাকলে add করবে, থাকলে skip
  db.query(
    `ALTER TABLE ob_hr_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'admin'`,
    (err) => {
      if (err) console.log("role column note:", err.message);

      // সঠিক column নামে seed — username + full_name + role
      const seeds = [
        ["admin@gmail.com",   "admin123", "Super Admin",   "admin"],
        ["hr@gmail.com",      "hr1234",   "HR Manager",    "hrmanager"],
        ["manager@gmail.com", "mgr1234",  "Reporting Mgr", "manager"],
      ];
      seeds.forEach(([username, password, full_name, role]) => {
        db.query(
          `INSERT IGNORE INTO ob_hr_users (username, password, full_name, role, is_active)
           VALUES (?, ?, ?, ?, 1)`,
          [username, password, full_name, role],
          (err) => { if (err) console.log("Seed note:", err.message); }
        );
      });
      console.log("✅ Default users seeded");
    }
  );
});

module.exports = db;