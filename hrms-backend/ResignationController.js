const ResignationModel = require("../models/ResignationModel");

const createResignation = async (req, res) => {
  try {
    const result = await ResignationModel.create(req.body);
    res.json({ success: true, id: result.insertId, message: "Resignation submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
};

const getAllResignations = async (req, res) => {
  try {
    const data = await ResignationModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/resignations/:id/status
// Body: { approverId: 5, newStatus: "Approved" }
const updateResignationStatus = async (req, res) => {
  const { id } = req.params;
  const { approverId, newStatus } = req.body;

  if (!["Approved", "Rejected"].includes(newStatus)) {
    return res.status(400).json({ success: false, message: "Invalid status." });
  }
  if (!approverId) {
    return res.status(400).json({ success: false, message: "approverId required." });
  }

  try {
    const result = await ResignationModel.updateStatus(id, approverId, newStatus);
    res.json({
      success: true,
      message: `Resignation ${newStatus} by ${result.approverName} (${result.approverRole})`,
    });
  } catch (err) {
    // Permission denied বা not found — 403
    const status = err.message.includes("Permission denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = { createResignation, getAllResignations, updateResignationStatus };