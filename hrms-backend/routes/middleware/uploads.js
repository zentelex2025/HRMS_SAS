const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanField = file.fieldname.replace(/\s/g, "");
    cb(null, `${Date.now()}-${cleanField}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  /jpeg|jpg|png|pdf/.test(ext) ? cb(null, true) : cb(new Error("Only jpg, jpeg, png, pdf allowed!"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

module.exports = upload.fields([
  { name: "photo",             maxCount: 1 },
  { name: "aadhaar",           maxCount: 1 },
  { name: "pan",               maxCount: 1 },
  { name: "voter",             maxCount: 1 },
  { name: "passport",          maxCount: 1 },
  { name: "marriage",          maxCount: 1 },
  { name: "madhyamikAdmit",    maxCount: 1 },
  { name: "cert10",            maxCount: 1 },
  { name: "cert12",            maxCount: 1 },
  { name: "gradCertificate",   maxCount: 1 },
  { name: "masterCertificate", maxCount: 1 },
  { name: "resume",            maxCount: 1 },  // ✅ এটা ADD করুন
  ...Array.from({ length: 20 }, (_, i) => ({ name: `educationCert_${i}`, maxCount: 1 })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `professionalCert_${i}`, maxCount: 1 })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `experienceCert_${i}`, maxCount: 1 })),
]);