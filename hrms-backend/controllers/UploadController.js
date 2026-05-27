exports.uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  res.json({
    message:      "File uploaded successfully",
    filename:     req.file.filename,
    originalname: req.file.originalname,
    path:         `/uploads/${req.file.filename}`,
    size:         req.file.size,
  });
};