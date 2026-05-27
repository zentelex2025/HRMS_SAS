const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // multerConfig.js আছে: routes/middleware/multerConfig.js
    // uploads folder আছে:  hrms-backend/uploads/
    // তাই: middleware/ → routes/ → hrms-backend/uploads/
    const dir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    console.log("📂 Saving file to:", dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext    = path.extname(file.originalname).toLowerCase();
    const base   = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const unique = Date.now() + "_" + base + ext;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|jpg|jpeg|png)$/i;
    const ext     = allowed.test(path.extname(file.originalname));
    const mime    = /^(application\/pdf|image\/(jpeg|jpg|png))$/.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed."));
  },
});

module.exports = upload;