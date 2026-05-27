const db = require("../config/db15");

// ─── Permission check: only Department Head ───────────────
async function checkPermission(approverId) {
  const [[approver]] = await db.execute(
    "SELECT * FROM employees WHERE id = ?",
    [approverId]
  );
  if (!approver) throw new Error("Approver not found");

  const designation = (approver.designation || "").toLowerCase().trim();
  if (designation !== "department head") {
    throw new Error("Permission denied. Only Department Head can perform this action.");
  }

  approver.employee_name =
    (approver.first_name || "") + " " + (approver.last_name || "");
  return approver;
}

class ResignationModel {
  // ─── CREATE ────────────────────────────────────────────
  static async create({ empId, name, email, designation, department, joiningDate, lastDate, reason }) {
    const [result] = await db.execute(
      `INSERT INTO resignations
         (emp_id, employee_name, employee_email, designation, department,
          joining_date, last_working_day, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [empId, name, email, designation, department, joiningDate, lastDate, reason]
    );
    return result;
  }

  // ─── GET ALL ───────────────────────────────────────────
  static async getAll() {
    const [rows] = await db.execute(
      "SELECT * FROM resignations ORDER BY created_at DESC"
    );
    return rows;
  }

  // ─── GET ONE ───────────────────────────────────────────
  static async getOne(id) {
    const [[row]] = await db.execute(
      "SELECT * FROM resignations WHERE id = ?",
      [id]
    );
    return row || null;
  }

  // ─── UPDATE STATUS (Approve / Reject) ─────────────────
  static async updateStatus(resignationId, approverId, newStatus) {
    const [[resignation]] = await db.execute(
      "SELECT * FROM resignations WHERE id = ?",
      [resignationId]
    );
    if (!resignation) throw new Error("Resignation not found");

    const approver = await checkPermission(approverId);

    await db.execute(
      `UPDATE resignations
         SET status = ?, approved_by = ?, approver_role = ?, approved_at = NOW()
       WHERE id = ?`,
      [newStatus, approver.employee_name, "department head", resignationId]
    );

    return { approverName: approver.employee_name, approverRole: "department head" };
  }

  // ─── EDIT ──────────────────────────────────────────────
  static async edit(resignationId, editorId, updateData) {
    const [[resignation]] = await db.execute(
      "SELECT * FROM resignations WHERE id = ?",
      [resignationId]
    );
    if (!resignation) throw new Error("Resignation not found");

    const editor = await checkPermission(editorId);
    const { empId, name, email, designation, department, joiningDate, lastDate, reason } = updateData;

    await db.execute(
      `UPDATE resignations
         SET emp_id = ?, employee_name = ?, employee_email = ?, designation = ?,
             department = ?, joining_date = ?, last_working_day = ?, reason = ?
       WHERE id = ?`,
      [
        empId        || resignation.emp_id,
        name         || resignation.employee_name,
        email        || resignation.employee_email,
        designation  || resignation.designation,
        department   || resignation.department,
        joiningDate  || resignation.joining_date,
        lastDate     || resignation.last_working_day,
        reason       || resignation.reason,
        resignationId,
      ]
    );

    return { editorName: editor.employee_name };
  }

  // ─── DELETE ────────────────────────────────────────────
  static async delete(resignationId, deleterId) {
    const [[resignation]] = await db.execute(
      "SELECT * FROM resignations WHERE id = ?",
      [resignationId]
    );
    if (!resignation) throw new Error("Resignation not found");

    const deleter = await checkPermission(deleterId);
    await db.execute("DELETE FROM resignations WHERE id = ?", [resignationId]);

    return { deleterName: deleter.employee_name };
  }

  static async ensureClearanceTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS resignation_clearances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resignation_id INT NOT NULL,
        emp_id VARCHAR(50),
        employee_name VARCHAR(200),
        employee_email VARCHAR(200),
        section_id VARCHAR(100),
        section_title VARCHAR(200),
        item_id VARCHAR(100),
        item_label VARCHAR(300),
        is_checked TINYINT(1) DEFAULT 0,
        note TEXT,
        submitted_at DATETIME,
        created_at DATETIME DEFAULT NOW(),
        updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
        INDEX (resignation_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  // ─── SAVE HR CLEARANCE ─────────────────────────────────
  static async saveClearance({ resignationId, employeeName, employeeEmail, empId, clearanceSections, submittedAt }) {
    const [[resignation]] = await db.execute(
      "SELECT id FROM resignations WHERE id = ?",
      [resignationId]
    );
    if (!resignation) throw new Error("Resignation not found");

    await ResignationModel.ensureClearanceTable();

    // Delete previous clearance for re-submit support
    await db.execute(
      "DELETE FROM resignation_clearances WHERE resignation_id = ?",
      [resignationId]
    );

    // Insert each item
    for (const section of clearanceSections) {
      for (const item of section.items) {
        await db.execute(
          `INSERT INTO resignation_clearances
             (resignation_id, emp_id, employee_name, employee_email, section_id, section_title,
              item_id, item_label, is_checked, note, submitted_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            resignationId,
            empId         || "",
            employeeName  || "",
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
      }
    }

    return { saved: true };
  }

  // ─── GET CLEARANCE FOR A RESIGNATION ──────────────────
  static async getClearance(resignationId) {
    await ResignationModel.ensureClearanceTable();
    const [rows] = await db.execute(
      `SELECT * FROM resignation_clearances
       WHERE resignation_id = ?
       ORDER BY section_id, item_id`,
      [resignationId]
    );
    return rows;
  }
}

module.exports = ResignationModel;