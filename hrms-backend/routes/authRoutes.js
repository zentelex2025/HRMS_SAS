// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// Public
// app.use("/api");
// app.use("/api/auth/login");
// app.use("/api/auth/register");

router.post("/auth/login", auth.login);
router.post("/auth/register", auth.register);

// Admin-protected (simple check — extend with JWT if needed)
router.get("/auth/users", auth.getAllUsers);
router.post("/auth/register", auth.register);
router.patch("/auth/users/:id/password", auth.changePassword);
router.patch("/auth/users/:id/status", auth.toggleStatus);
router.delete("/auth/users/:id", auth.deleteUser);

module.exports = router;
