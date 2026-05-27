const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");

require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ uploads folder auto-create করবে যদি না থাকে
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ uploads folder created:", uploadDir);
}

// ✅ Static file serving — এই path MulterConfig.js-এর path-এর সাথে মিলতে হবে
app.use("/uploads", express.static(uploadDir));

// ✅ Debug: server start-এ path দেখাবে
console.log("📁 Uploads folder path:", uploadDir);

app.use("/api/leaves",        require("./routes/leaveRoutes1"));
app.use("/api/leave-balance", require("./routes/leaveBalanceRoutes"));
app.use("/api/upload",        require("./routes/uploadRoutes"));

app.listen(5004, () => {
  console.log("🚀 Server running on http://localhost:5004");
  console.log("🖼️  Uploads accessible at http://localhost:5004/uploads/<filename>");
});