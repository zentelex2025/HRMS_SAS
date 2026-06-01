// ─── routes/ResignationRoutes.js ────────────────────────
const express = require("express");
const router = express.Router();

const {
  createResignation,
  getAllResignations,
  getResignationById,
  editResignation,
  saveClearance,
  getClearance,
} = require("../controllers/ResignationController");

const { validateResignation } = require("../middlewares/ValidateResignation");

// NOTE: specific routes (/:id/clearance) must come BEFORE generic (/:id)
router.post("/", validateResignation, createResignation);
router.get("/", getAllResignations);

router.post("/:id/clearance", saveClearance);
router.get("/:id/clearance", getClearance);

router.get("/:id", getResignationById);
router.put("/:id", editResignation);

module.exports = router;
