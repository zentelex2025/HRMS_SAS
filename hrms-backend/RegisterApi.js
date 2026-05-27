require("./config/db");
const employeeRoutes = require("./routes/EmployeeRoutes");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ CORS setup
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Uploads path — uploads folder in project root
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Uploads folder created:", uploadsPath);
}

console.log("📁 Uploads path:", uploadsPath);
console.log("📁 Uploads exists:", fs.existsSync(uploadsPath));

try {
  const uploadedFiles = fs.readdirSync(uploadsPath);
  console.log("📂 Files in uploads:", uploadedFiles.length, "files");
  if (uploadedFiles.length > 0) {
    console.log("   First few:", uploadedFiles.slice(0, 3));
  }
} catch (e) {
  console.log("⚠️ Could not read uploads folder:", e.message);
}

// ✅ Static file serving — must be placed before /api
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Cache-Control", "public, max-age=31536000");
  next();
}, express.static(uploadsPath, {
  fallthrough: false,
}));

// ✅ 404 handler only for /uploads
app.use("/uploads", (err, req, res, next) => {
  if (err.status === 404) {
    const requestedFile = path.basename(req.path);
    const fullPath = path.join(uploadsPath, requestedFile);
    console.log("❌ File not found:", fullPath);
    console.log("📂 Available files:", fs.readdirSync(uploadsPath).slice(0, 5));
    return res.status(404).json({
      error: "File not found",
      requested: req.path,
      uploadsPath,
    });
  }
  next(err);
});

// ✅ Test route
app.get("/test", (req, res) => {
  const files = fs.readdirSync(uploadsPath);
  res.json({
    ok: true,
    uploadsPath,
    uploadsExists: fs.existsSync(uploadsPath),
    totalFiles: files.length,
    recentFiles: files.slice(-10),
    sampleUrl: `http://localhost:5001/uploads/${files[files.length - 1]}`,
  });
});

// ✅ API routes
app.use("/api", employeeRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/test`);
  console.log(`🖼️ Uploads: http://localhost:${PORT}/uploads/`);
});