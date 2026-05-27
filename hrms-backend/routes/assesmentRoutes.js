// routes/assessmentRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/assessmentController");
const { upload } = require("../middlewares/upload9");
const { generateAssessmentPDF } = require("../utils/pdfGenerator");

router.get("/assessments", ctrl.getAll);
router.get("/assessments/:id", ctrl.getOne);
router.post("/assessments", ctrl.create);
router.delete("/assessments/:id", ctrl.remove);

router.patch("/assessments/:id/verdict", ctrl.updateVerdict);
router.patch(
  "/assessments/:id/offer-letter",
  upload.single("offerLetter"),
  ctrl.updateOfferLetter,
);
router.post(
  "/upload-offer-letter",
  upload.single("offerLetter"),
  ctrl.uploadOfferLetter,
);

router.get("/assessments/:id/hr-view", ctrl.hrView);
router.get("/assessments/:id/hod-view", ctrl.hodView);

router.get("/stats", ctrl.stats);

// ✅ এই route টি যোগ করুন — :id route এর আগে রাখতে হবে
router.get("/assessments/export/pdf", async (req, res) => {
  try {
    const { db } = require("../config/db12");
    const [rows] = await db.query(
      "SELECT * FROM assessments ORDER BY created_at DESC",
    );
    generateAssessmentPDF(rows, res);
  } catch (err) {
    console.error("PDF error:", err.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;
