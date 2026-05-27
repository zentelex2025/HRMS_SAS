const db = require("../config/db13");

// ═══════════════════════════════════════════════════════════════
//  MODEL  (real columns: id, username, password, full_name, role, is_active)
// ═══════════════════════════════════════════════════════════════

const UserModel = {

  findByUsernameAndRole: (username, role, callback) => {
    db.query(
      `SELECT id, full_name, username, role, password
       FROM ob_hr_users
       WHERE username = ? AND role = ? AND is_active = 1
       LIMIT 1`,
      [username, role],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0] || null);
      }
    );
  },

  getAllUsers: (callback) => {
    db.query(
      `SELECT id, full_name, username, role, is_active, created_at
       FROM ob_hr_users ORDER BY id DESC`,
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
      }
    );
  },

  createUser: (username, password, full_name, role, callback) => {
    db.query(
      `SELECT id FROM ob_hr_users WHERE username = ? LIMIT 1`,
      [username],
      (err, results) => {
        if (err) return callback(err, null);
        if (results.length > 0) return callback(new Error("Email already registered."), null);

        db.query(
          `INSERT INTO ob_hr_users (username, password, full_name, role, is_active) VALUES (?, ?, ?, ?, 1)`,
          [username, password, full_name, role],
          (err, result) => {
            if (err) return callback(err, null);
            callback(null, result.insertId);
          }
        );
      }
    );
  },
};

module.exports = UserModel;