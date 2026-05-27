// ─── Models/ResignationModal.js ──────────────────────────
const db = require("../config/db");

class ResignationModal {

  // ── CREATE ────────────────────────────────────────────
  static async create({ empId, name, email, designation, department, joiningDate, lastDate, reason }) {
    const [result] = await db.execute(
      `INSERT INTO resignations
         (emp_id, employee_name, employee_email,
          designation, department,
          joining_date, last_working_day,
          reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empId        || "",
        name         || "",
        email        || "",
        designation  || "",
        department   || "",
        joiningDate  || null,
        lastDate     || null,
        reason       || "",
      ]
    );
    return result;
  }

  // ── GET ALL ───────────────────────────────────────────
  static async getAll() {
    const [rows] = await db.execute(
      "SELECT * FROM resignations ORDER BY created_at DESC"
    );
    return rows;
  }

  // ── GET ONE ───────────────────────────────────────────
  static async getOne(id) {
    const [rows] = await db.execute(
      "SELECT * FROM resignations WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  }

  // ── EDIT ──────────────────────────────────────────────
  static async edit(id, editorId, data) {
    const [rows] = await db.execute(
      "SELECT * FROM resignations WHERE id = ? LIMIT 1",
      [id]
    );
    if (!rows[0]) throw new Error("Resignation not found.");

    const fields = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(data), id];
    await db.execute(`UPDATE resignations SET ${fields}, updated_at = NOW() WHERE id = ?`, values);
    return { editorName: editorId };
  }
}

module.exports = ResignationModal;