// ============================================================
//  controllers/RegisterController.js
//  Business Logic এখানে থাকবে (MVC → Controller Layer)
// ============================================================

const RegisterModel = require("../models/RegisterModel");

const RegisterController = {

  // ✅ POST /api/register — নতুন Employee যোগ করা
  registerEmployee: (req, res) => {
    const d = req.body;

    // ── Step 1: Required field validation ──
    if (!d.employeeId || !d.name || !d.email || !d.department || !d.designation) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, Name, Email, Department ও Designation আবশ্যক।",
      });
    }

    // ── Step 2: Email format validation ──
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(d.email)) {
      return res.status(400).json({
        success: false,
        message: "শুধুমাত্র @gmail.com email গ্রহণযোগ্য।",
      });
    }

    // ── Step 3: Phone validation (যদি দেওয়া থাকে) ──
    if (d.mobileNo && !/^\d{10}$/.test(d.mobileNo)) {
      return res.status(400).json({
        success: false,
        message: "Phone number অবশ্যই ১০ সংখ্যার হতে হবে।",
      });
    }

    // ── Step 4: Duplicate email চেক ──
    RegisterModel.findByEmail(d.email, (err, existing) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "এই email দিয়ে আগেই একজন employee registered আছেন।",
        });
      }

      // ── Step 5: Database এ Insert ──
      RegisterModel.createEmployee(d, (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        res.status(201).json({
          success: true,
          message: "Employee সফলভাবে registered হয়েছে! Default Password: Admin@123",
          insertedId: result.insertId,
        });
      });
    });
  },
};

module.exports = RegisterController;