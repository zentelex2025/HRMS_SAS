// ================================================================
//  middleware/upload.js — Multer File Upload Configuration
// ================================================================

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only images and PDFs are allowed"));
};

const upload = multer({ storage, fileFilter });

const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhaar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "marksheet10", maxCount: 1 },
  { name: "marksheet12", maxCount: 1 },
  { name: "gradCertificate", maxCount: 1 },
  { name: "offerLetter", maxCount: 1 },
  { name: "experienceLetter", maxCount: 1 },
  { name: "extraCertificate", maxCount: 1 },
]);

module.exports = uploadFields;