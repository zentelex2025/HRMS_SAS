// ─── controllers/ResignationController.js ───────────────
require("dotenv").config();

const ResignationModel = require("../Models/ResignationModal");
const db               = require("../config/db15");
const nodemailer       = require("nodemailer");

// ✅ DEFAULT EMAIL (ONLY ONE EMAIL USED)
const DEFAULT_EMAIL = "tonuja@gmail.com";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

async function sendMail(to, subject, html) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn("⚠ Mail skipped — MAIL_USER / MAIL_PASS not set in .env");
    return;
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`📧 Mail sent → ${to}`);
  } catch (err) {
    console.error("❌ Mail Error:", err.message);
  }
}

async function sendPushNotification({ title, body, targetEmail }) {
  console.log(`🔔 Push → [${targetEmail}] "${title}": ${body}`);
}

// ─── CREATE ──────────────────────────────────────────────
const createResignation = async (req, res) => {
  try {
    const result = await ResignationModel.create(req.body);
    const newId = result.insertId;

    const employeeEmail = req.body.email || DEFAULT_EMAIL;

    // Employee confirmation mail
    await sendMail(
      employeeEmail,
      "Resignation Submitted — Confirmation",
      `<p>Dear <strong>${req.body.name || "Employee"}</strong>,</p>
       <p>Your resignation has been received and is under review.</p>
       <p>You will be notified at each stage of the clearance process.</p>
       <br><p>Regards,<br>HR Team</p>`
    );

    // Admin / System notification (ONLY DEFAULT EMAIL)
    await sendMail(
      DEFAULT_EMAIL,
      `[HRMS] New Resignation Submitted`,
      `<p><strong>Employee:</strong> ${req.body.name} (${req.body.email})<br>
       <strong>Department:</strong> ${req.body.department}</p>`
    );

    await sendPushNotification({
      title: "Resignation Submitted",
      body: "A new resignation is pending review.",
      targetEmail: employeeEmail,
    });

    res.status(201).json({
      success: true,
      id: newId,
      message: "Resignation submitted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database error: " + err.message,
    });
  }
};

// ─── GET ALL ─────────────────────────────────────────────
const getAllResignations = async (req, res) => {
  try {
    const data = await ResignationModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ONE ─────────────────────────────────────────────
const getResignationById = async (req, res) => {
  try {
    const resignation = await ResignationModel.getOne(req.params.id);

    if (!resignation) {
      return res.status(404).json({
        success: false,
        message: "Resignation not found.",
      });
    }

    res.json({
      success: true,
      data: {
        id: resignation.id,
        empId: resignation.emp_id,
        name: resignation.employee_name,
        email: resignation.employee_email,
        designation: resignation.designation,
        department: resignation.department,
        joiningDate: resignation.joining_date,
        lastDate: resignation.last_working_day,
        reason: resignation.reason,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── EDIT ────────────────────────────────────────────────
const editResignation = async (req, res) => {
  const { id } = req.params;
  const { editorId, ...updateData } = req.body;

  if (!editorId) {
    return res.status(400).json({
      success: false,
      message: "editorId is required.",
    });
  }

  try {
    const result = await ResignationModel.edit(id, editorId, updateData);
    res.json({
      success: true,
      message: `Updated by ${result.editorName}`,
    });
  } catch (err) {
    const code = err.message.includes("not found") ? 404 : 500;
    res.status(code).json({ success: false, message: err.message });
  }
};

// ─── SAVE HR CLEARANCE ───────────────────────────────────
const saveClearance = async (req, res) => {
  const resignationId = req.params.id;

  const {
    empId,
    employeeName,
    employeeEmail,
    clearanceSections,
    submittedAt,
    allCompleted,
    submittedByRole,
  } = req.body;

  console.log("═══════════════════════════════");
  console.log("📥 saveClearance HIT — ID:", resignationId);
  console.log("👤 empId:", empId, "| role:", submittedByRole);
  console.log("📦 sections count:", clearanceSections?.length);
  console.log("═══════════════════════════════");

  if (!clearanceSections || !Array.isArray(clearanceSections)) {
    return res.status(400).json({
      success: false,
      message: "clearanceSections must be an array.",
    });
  }

  try {
    const sectionIds = [
      ...new Set(clearanceSections.map((s) => s.sectionId).filter(Boolean)),
    ];

    if (sectionIds.length) {
      await db.execute(
        `DELETE FROM resignation_clearances
         WHERE resignation_id = ?
         AND section_id IN (${sectionIds.map(() => "?").join(",")})`,
        [resignationId, ...sectionIds]
      );
    }

    let insertCount = 0;

    for (const section of clearanceSections) {
      for (const item of section.items) {
        await db.execute(
          `INSERT INTO resignation_clearances
           (resignation_id, emp_id, employee_name, employee_email,
            section_id, section_title, item_id, item_label,
            is_checked, note, submitted_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            resignationId,
            empId || "",
            employeeName || "",
            employeeEmail || "",
            section.sectionId,
            section.sectionTitle,
            item.id,
            item.label,
            item.checked ? 1 : 0,
            item.note || "",
            submittedAt || new Date().toISOString(),
          ]
        );

        insertCount++;
      }
    }

    console.log(`✅ Rows inserted: ${insertCount}`);

    if (employeeEmail) {
      const roleLabels = {
        rm: "Immediate Boss (RM)",
        hod: "Department Head (HOD)",
        hr: "HR Head",
        admin: "Admin",
        finance: "Finance",
      };

      const roleLabel =
        roleLabels[submittedByRole] || submittedByRole || "A reviewer";

      const toEmail = employeeEmail || DEFAULT_EMAIL;

      // Employee mail
      await sendMail(
        toEmail,
        "Clearance Update — Resignation",
        `<p>Dear <strong>${employeeName || "Employee"}</strong>,</p>
         <p><strong>${roleLabel}</strong> has submitted clearance for your resignation.</p>
         ${
           allCompleted
             ? "<p>✅ <strong>All clearance steps are now complete!</strong></p>"
             : "<p>Further steps are still pending.</p>"
         }
         <br><p>Regards,<br>HR Team</p>`
      );

      // System mail (ONLY DEFAULT EMAIL)
      await sendMail(
        DEFAULT_EMAIL,
        `[HRMS] Clearance by ${roleLabel}`,
        `<p><strong>Role:</strong> ${roleLabel}<br>
         <strong>Employee:</strong> ${employeeName} (${employeeEmail})<br>
         <strong>Sections saved:</strong> ${sectionIds.join(", ")}<br>
         <strong>All completed:</strong> ${
           allCompleted ? "Yes ✅" : "No ⏳"
         }</p>`
      );

      await sendPushNotification({
        title: `Clearance: ${roleLabel} submitted`,
        body: allCompleted
          ? "All clearance steps complete!"
          : "Step completed",
        targetEmail: employeeEmail,
      });
    }

    res.json({
      success: true,
      message: `Clearance saved. ${insertCount} rows inserted.`,
    });
  } catch (err) {
    console.error("❌ saveClearance error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET CLEARANCE ───────────────────────────────────────
const getClearance = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM resignation_clearances WHERE resignation_id = ? ORDER BY section_id, item_id",
      [req.params.id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── EXPORT ──────────────────────────────────────────────
module.exports = {
  createResignation,
  getAllResignations,
  getResignationById,
  editResignation,
  saveClearance,
  getClearance,
};