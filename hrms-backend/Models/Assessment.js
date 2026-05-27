// models/Assessment.js
// Model — all raw SQL interactions for assessments

const { db } = require("../config/db12");

const Assessment = {
  async findAll() {
    const [rows] = await db.query(
      "SELECT * FROM assessments ORDER BY created_at DESC"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM assessments WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create(fields) {
    const [result] = await db.query(
      `INSERT INTO assessments (
        candidate_name, designation, applied_role, job_role, qualification,
        expected_salary, final_salary, interview_date, interview_time,
        hr_name, hr_designation, hr_panel,
        hod_name, hod_designation, hod_department,
        grade_personality, grade_english, grade_behaviour, grade_communication, grade_cultural,
        grade_domain, grade_analytical, grade_technical, grade_problem, grade_aptitude,
        grade_leadership, grade_teamwork, grade_strategic, grade_motivation, grade_overall_imp,
        comment_round1, comment_round2, comment_round3,
        verdict, hr_comments, overall_grade, offer_letter_path
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?
      )`,
      [
        fields.name, fields.designation, fields.appliedRole, fields.jobRole, fields.qualification,
        fields.expectedSalary, fields.finalSalary,
        fields.iDate || null, fields.iTime || null,
        fields.hrName, fields.hrDesignation, fields.hrPanel,
        fields.hodName, fields.hodDesignation, fields.hodDepartment,
        fields.grade_personality, fields.grade_english, fields.grade_behaviour,
        fields.grade_communication, fields.grade_cultural,
        fields.grade_domain, fields.grade_analytical, fields.grade_technical,
        fields.grade_problem, fields.grade_aptitude,
        fields.grade_leadership, fields.grade_teamwork, fields.grade_strategic,
        fields.grade_motivation, fields.grade_overall_imp,
        fields.comment_round1, fields.comment_round2, fields.comment_round3,
        fields.verdict, fields.hrComments, fields.overallGrade,
        fields.offerLetterPath || null,
      ]
    );
    return result.insertId;
  },

  async updateVerdict(id, verdict) {
    await db.query(
      "UPDATE assessments SET verdict = ?, updated_at = NOW() WHERE id = ?",
      [verdict, id]
    );
  },

  async updateOfferLetter(id, filename) {
    await db.query(
      "UPDATE assessments SET offer_letter_path = ?, updated_at = NOW() WHERE id = ?",
      [filename, id]
    );
  },

  async delete(id) {
    await db.query("DELETE FROM assessments WHERE id = ?", [id]);
  },

  async getOfferLetterPath(id) {
    const [rows] = await db.query(
      "SELECT offer_letter_path FROM assessments WHERE id = ?",
      [id]
    );
    return rows[0]?.offer_letter_path || null;
  },

  async findHRView(id) {
    const [rows] = await db.query(
      `SELECT id, candidate_name, applied_role, job_role, qualification,
        expected_salary, final_salary, interview_date, interview_time,
        hr_name, hr_designation, hr_panel,
        hr_comments, verdict,
        grade_personality, grade_english, grade_behaviour, grade_communication, grade_cultural,
        comment_round1, overall_grade
       FROM assessments WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findHODView(id) {
    const [rows] = await db.query(
      `SELECT id, candidate_name, applied_role, job_role, qualification,
        hod_name, hod_designation, hod_department, verdict,
        grade_domain, grade_analytical, grade_technical, grade_problem, grade_aptitude,
        grade_leadership, grade_teamwork, grade_strategic, grade_motivation, grade_overall_imp,
        comment_round2, comment_round3, overall_grade
       FROM assessments WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getStats() {
    const [total] = await db.query("SELECT COUNT(*) as cnt FROM assessments");
    const [byVerdict] = await db.query(
      "SELECT verdict, COUNT(*) as cnt FROM assessments GROUP BY verdict"
    );
    const [avgGrade] = await db.query(
      `SELECT AVG(
        CASE overall_grade
          WHEN 'A' THEN 5 WHEN 'B' THEN 4 WHEN 'C' THEN 3
          WHEN 'D' THEN 2 WHEN 'F' THEN 1 ELSE 0
        END
      ) as avg_score FROM assessments WHERE overall_grade IS NOT NULL`
    );
    const [byDept] = await db.query(
      `SELECT hod_department, COUNT(*) as cnt
       FROM assessments WHERE hod_department IS NOT NULL
       GROUP BY hod_department`
    );
    return {
      total: total[0].cnt,
      byVerdict,
      avgScore: avgGrade[0].avg_score
        ? parseFloat(avgGrade[0].avg_score).toFixed(2)
        : null,
      byDepartment: byDept,
    };
  },
};

module.exports = Assessment;