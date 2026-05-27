// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const candidateName = (req.body.candidateName || "candidate")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    cb(null, `offer_${candidateName}_${Date.now()}.pdf`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

module.exports = { upload, UPLOADS_DIR };