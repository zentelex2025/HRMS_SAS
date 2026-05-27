const express = require("express");
const router  = express.Router();
const upload  = require("./middleware/multerConfig"); // ✅ শুধু এই একটাই রাখুন

router.post("/", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = `/uploads/${req.file.filename}`;

  console.log("✅ File uploaded:", req.file.filename);

  res.json({
    filename:     req.file.filename,
    originalname: req.file.originalname,
    path:         filePath,
    size:         req.file.size,
    mimetype:     req.file.mimetype,
  });
});

module.exports = router;
