const UserModel = require("../Models/UserModal");

// ═══════════════════════════════════════════════════════════════
//  CONTROLLER
// ═══════════════════════════════════════════════════════════════

const VALID_ROLES = ["admin", "hrmanager", "manager"];

const AuthController = {

  // POST /api/login
  login: (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ success: false, error: "Email, password, and role are required." });

    if (!VALID_ROLES.includes(role))
      return res.status(400).json({ success: false, error: "Invalid role selected." });

    UserModel.findByUsernameAndRole(email, role, (err, user) => {
      if (err) {
        console.error("DB error:", err.message);
        return res.status(500).json({ success: false, error: "Database error." });
      }
      if (!user)
        return res.status(401).json({ success: false, error: "No account found for this email and role." });

      if (user.password !== password)
        return res.status(401).json({ success: false, error: "Invalid credentials." });

      return res.status(200).json({
        success: true,
        user: {
          id    : user.id,
          name  : user.full_name,
          email : user.username,
          role  : user.role,
        },
      });
    });
  },

  // POST /api/register
  register: (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, error: "All fields are required." });

    if (!VALID_ROLES.includes(role))
      return res.status(400).json({ success: false, error: "Invalid role." });

    UserModel.createUser(email, password, name, role, (err, insertId) => {
      if (err) {
        console.error("Register error:", err.message);
        return res.status(409).json({ success: false, error: err.message });
      }
      return res.status(201).json({ success: true, userId: insertId });
    });
  },

  // GET /api/users
  getUsers: (req, res) => {
    UserModel.getAllUsers((err, users) => {
      if (err) return res.status(500).json({ success: false, error: "DB error." });
      return res.json({ success: true, users });
    });
  },
};

module.exports = AuthController;