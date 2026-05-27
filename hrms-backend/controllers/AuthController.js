const { db } = require("../config/db12");
const bcrypt = require("bcryptjs");

const authController = {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Email and password are required" });

      const [rows] = await db.query(
        "SELECT * FROM interview_users WHERE email = ? AND is_active = 1",
        [email],
      );

      if (rows.length === 0)
        return res.status(401).json({ error: "Invalid email or password" });

      // controllers/authController.js er login function e bhashan:
      const user = rows[0];
      console.log("Database user found:", user ? "YES" : "NO");
      if (user) {
        console.log("Input Pass:", password);
        console.log("DB Pass Hash:", user.password_hash);
        const match = await bcrypt.compare(password, user.password_hash);
        console.log("Match Result:", match);
      }

      // Compare hashed password
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match)
        return res.status(401).json({ error: "Invalid email or password" });

      // Update last login
      await db.query(
        "UPDATE interview_users SET last_login = NOW() WHERE id = ?",
        [user.id],
      );

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        label: user.label,
      });
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ error: "Login failed" });
    }
  },

  // GET /api/auth/users  — admin only
  async getAllUsers(req, res) {
    try {
      const [rows] = await db.query(
        "SELECT id, email, name, role, label, is_active, created_at, last_login FROM interview_users ORDER BY created_at ASC",
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // POST /api/auth/register  — admin only
  async register(req, res) {
    try {
      const { email, password, name, role, label } = req.body;
      if (!email || !password || !name || !role)
        return res
          .status(400)
          .json({ error: "email, password, name, role are required" });

      if (!["admin", "hr", "hod"].includes(role))
        return res
          .status(400)
          .json({ error: "role must be admin, hr, or hod" });

      // Check duplicate
      const [existing] = await db.query(
        "SELECT id FROM interview_users WHERE email = ?",
        [email],
      );
      if (existing.length > 0)
        return res.status(409).json({ error: "Email already registered" });

      const hash = await bcrypt.hash(password, 10);
      const roleLabel =
        label ||
        (role === "admin"
          ? "Administrator"
          : role === "hr"
            ? "HR Manager"
            : "HOD");

      const [result] = await db.query(
        `INSERT INTO interview_users (email, password_hash, name, role, label, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [email, hash, name, role, roleLabel],
      );

      res
        .status(201)
        .json({ id: result.insertId, email, name, role, label: roleLabel });
    } catch (err) {
      console.error("Register error:", err.message);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  // PATCH /api/auth/users/:id/password
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 4)
        return res
          .status(400)
          .json({ error: "Password must be at least 4 characters" });

      const hash = await bcrypt.hash(newPassword, 10);
      await db.query(
        "UPDATE interview_users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
        [hash, id],
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to change password" });
    }
  },

  // PATCH /api/auth/users/:id/status
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      await db.query(
        "UPDATE interview_users SET is_active = ?, updated_at = NOW() WHERE id = ?",
        [is_active ? 1 : 0, id],
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  },

  // DELETE /api/auth/users/:id
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM interview_users WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};

module.exports = authController;
