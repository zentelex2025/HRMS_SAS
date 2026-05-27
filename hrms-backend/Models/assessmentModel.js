const { getDB } = require("../config/db12");

const db = getDB();

// GET all
exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM assessments ORDER BY created_at DESC");
  return rows;
};

// GET by id
exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM assessments WHERE id = ?", [id]);
  return rows;
};

// INSERT
exports.create = async (data, flat) => {
  const [result] = await db.query(`
    INSERT INTO assessments (
      candidate_name, designation, applied_role, job_role, qualification,
      expected_salary, final_salary, interview_date, interview_time,
      hr_name, hr_designation, hr_panel,
      hod_name, hod_designation, hod_department,
      grade_personality, grade_english, grade_behaviour, grade_communication, grade_cultural,
      grade_domain, grade_analytical, grade_technical, grade_problem, grade_aptitude,
      grade_leadership, grade_teamwork, grade_strategic, grade_motivation, grade_overall_imp,
      comment_round1, comment_round2, comment_round3,
      verdict, hr_comments, overall_grade, offer_letter_path
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `, [
    data.name, data.designation, data.appliedRole, data.jobRole, data.qualification,
    data.expectedSalary, data.finalSalary,
    data.iDate || null, data.iTime || null,
    data.hrName, data.hrDesignation, data.hrPanel,
    data.hodName, data.hodDesignation, data.hodDepartment,

    flat.grade_personality, flat.grade_english, flat.grade_behaviour, flat.grade_communication, flat.grade_cultural,
    flat.grade_domain, flat.grade_analytical, flat.grade_technical, flat.grade_problem, flat.grade_aptitude,
    flat.grade_leadership, flat.grade_teamwork, flat.grade_strategic, flat.grade_motivation, flat.grade_overall_imp,

    flat.comment_round1, flat.comment_round2, flat.comment_round3,
    data.verdict, data.hrComments, data.overallGrade,
    data.offerLetterPath || null,
  ]);

  return result.insertId;
};