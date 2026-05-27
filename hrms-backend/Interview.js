// server.js — entry point
// Run: npm install && node server.js
// npm install express mysql2 cors multer bcryptjs

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const { db, initDB }      = require("./config/db12");
const assessmentRoutes    = require("./routes/assesmentRoutes");
const authRoutes          = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", authRoutes);        // /api/auth/login, /api/auth/register, etc.
app.use("/api", assessmentRoutes);  // /api/assessments, etc.

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL connected");
    await initDB();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Interview Assessment API → http://localhost:${PORT}`);
      console.log(`   Auth routes: POST /api/auth/login`);
      console.log(`   Seed users:  node scripts/seedUsers.js`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
})();