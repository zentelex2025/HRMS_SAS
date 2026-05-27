const express    = require("express");
const cors       = require("cors");
const authRoutes = require("./routes/AuthRouter");

// db connect করার জন্য import (side-effect: connects on load)
require("./config/db13");

// ═══════════════════════════════════════════════════════════════
//  APP SETUP
// ═══════════════════════════════════════════════════════════════

const app  = express();
const PORT = process.env.PORT || 5026;

app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════════════

app.get("/", (req, res) => res.send("✅ HR Portal API running"));
app.use("/api", authRoutes);

// ═══════════════════════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`\n🚀 Server → http://localhost:${PORT}`);
  console.log("   POST /api/login");
  console.log("   POST /api/register");
  console.log("   GET  /api/users\n");
});

module.exports = app;