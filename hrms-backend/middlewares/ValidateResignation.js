// ─── Validate Resignation Submit ─────────────────────────
const validateResignation = (req, res, next) => {
  const { empId, name, email, designation, department, joiningDate, lastDate, reason } = req.body;

  const missing = [];
  if (!empId?.toString().trim()) missing.push("empId");
  if (!name?.trim())             missing.push("name");
  if (!email?.trim())            missing.push("email");
  if (!designation?.trim())      missing.push("designation");
  if (!department?.trim())       missing.push("department");
  if (!joiningDate)              missing.push("joiningDate");
  if (!lastDate)                 missing.push("lastDate");
  if (!reason?.trim())           missing.push("reason");

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(", ")}`,
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }

  // Validate dates
  const joining = new Date(joiningDate);
  const last    = new Date(lastDate);
  if (isNaN(joining.getTime()) || isNaN(last.getTime())) {
    return res.status(400).json({ success: false, message: "Invalid date format." });
  }
  if (last <= joining) {
    return res.status(400).json({
      success: false,
      message: "Last working day must be after joining date.",
    });
  }

  next();
};

module.exports = { validateResignation };