// ================================================================
//  controllers/employeeController.js — All Business Logic
// ================================================================

const db = require("../config/db");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// ─────────────────────────────────────────────
// GET ALL EMPLOYEES — password বাদ দিয়ে
// ─────────────────────────────────────────────
const getAllEmployees = (req, res) => {
  const sql = `
    SELECT 
      id, employee_id, user_id, name, fathers_name, designation, department,
      email, mobile_no, emergency_contact, blood_group, marital_status,
      present_address, permanent_address,
      photo, aadhaar, pan, marksheet10, marksheet12,
      grad_certificate, offer_letter, experience_letter, extra_certificate,
      created_at
    FROM employees 
    ORDER BY id DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: result });
  });
};

// ─────────────────────────────────────────────
// LOGIN — plain text + bcrypt দুটোই support
// ─────────────────────────────────────────────
const loginEmployee = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM employees WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });

    if (result.length === 0)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const emp = result[0];
    let valid = false;

    // bcrypt hash নাকি plain text চেক করো
    const isBcryptHash = emp.password && emp.password.startsWith("$2");

    if (isBcryptHash) {
      valid = await bcrypt.compare(password, emp.password);
    } else {
      // Plain text — সরাসরি compare, তারপর auto upgrade
      valid = password === emp.password;
      if (valid) {
        const hashed = await bcrypt.hash(emp.password, 10);
        db.query("UPDATE employees SET password = ? WHERE id = ?", [hashed, emp.id], (updateErr) => {
          if (updateErr) console.error("⚠️ Hash upgrade failed:", updateErr.message);
          else console.log(`✅ Password upgraded for: ${emp.email}`);
        });
      }
    }

    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    // Password response এ পাঠাবে না
    delete emp.password;
    res.json({ success: true, employee: emp });
  });
};

// ─────────────────────────────────────────────
// REGISTER — documents সহ
// ─────────────────────────────────────────────
const registerEmployee = async (req, res) => {
  try {
    const d = req.body;
    const f = req.files || {};

    const hashedPassword = await bcrypt.hash(d.password || "Admin@123", 10);

    const sql = `
      INSERT INTO employees 
      (employee_id, user_id, name, fathers_name, designation, department, email, password,
       mobile_no, emergency_contact, blood_group, marital_status,
       present_address, permanent_address,
       photo, aadhaar, pan,
       marksheet10, marksheet12, grad_certificate,
       offer_letter, experience_letter, extra_certificate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      d.employeeId, d.userId, d.name, d.fathersName, d.designation,
      d.department, d.email, hashedPassword, d.mobileNo, d.emergencyContact,
      d.bloodGroup, d.maritalStatus, d.presentAddress, d.permanentAddress,
      f?.photo?.[0]?.filename || null,
      f?.aadhaar?.[0]?.filename || null,
      f?.pan?.[0]?.filename || null,
      f?.marksheet10?.[0]?.filename || null,
      f?.marksheet12?.[0]?.filename || null,
      f?.gradCertificate?.[0]?.filename || null,
      f?.offerLetter?.[0]?.filename || null,
      f?.experienceLetter?.[0]?.filename || null,
      f?.extraCertificate?.[0]?.filename || null,
    ];

    db.query(sql, values, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          return res.status(409).json({ success: false, message: "Employee ID or Email already exists." });
        throw err;
      }
      res.json({ success: true, message: "✅ Registered with documents" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────────────────────
const changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  db.query("SELECT * FROM employees WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    if (result.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    const emp = result[0];
    let valid = false;

    const isBcryptHash = emp.password && emp.password.startsWith("$2");
    if (isBcryptHash) {
      valid = await bcrypt.compare(oldPassword, emp.password);
    } else {
      valid = oldPassword === emp.password;
    }

    if (!valid)
      return res.status(401).json({ success: false, message: "Wrong old password" });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE employees SET password = ? WHERE email = ?", [hashedNew, email], (err) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      res.json({ success: true, message: "✅ Password updated successfully" });
    });
  });
};

// ─────────────────────────────────────────────
// DELETE EMPLOYEE + FILES
// ─────────────────────────────────────────────
const deleteEmployee = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    if (result.length === 0)
      return res.status(404).json({ success: false, message: "Employee not found" });

    // Disk থেকে files delete করো
    const fileFields = [
      "photo", "aadhaar", "pan", "marksheet10", "marksheet12",
      "grad_certificate", "offer_letter", "experience_letter", "extra_certificate",
    ];
    fileFields.forEach((f) => {
      if (result[0][f]) {
        const filePath = path.join(__dirname, "../uploads", result[0][f]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    db.query("DELETE FROM employees WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      res.json({ success: true, message: "✅ Employee deleted" });
    });
  });
};

module.exports = {
  getAllEmployees,
  loginEmployee,
  registerEmployee,
  changePassword,
  deleteEmployee,
};