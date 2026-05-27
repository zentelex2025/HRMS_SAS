// helpers/formatters.js
// View helpers — shape raw DB rows into API-friendly JSON

const CRITERIA_MAP = [
  ["personality", "english", "behaviour", "communication", "cultural"],
  ["domain", "analytical", "technical", "problem", "aptitude"],
  ["leadership", "teamwork", "strategic", "motivation", "overall_imp"],
];

function flattenGrades(roundGrades = [], roundComments = []) {
  const flat = {};
  CRITERIA_MAP.forEach((keys, i) => {
    keys.forEach((ck) => {
      flat[`grade_${ck}`] = roundGrades[i]?.[ck] || null;
    });
    flat[`comment_round${i + 1}`] = roundComments[i] || null;
  });
  return flat;
}

function expandGrades(row) {
  return CRITERIA_MAP.map((keys) => {
    const obj = {};
    keys.forEach((k) => {
      obj[k] = row[`grade_${k}`] || "";
    });
    return obj;
  });
}

function formatRow(row) {
  return {
    id: row.id,
    name: row.candidate_name,
    designation: row.designation,
    appliedRole: row.applied_role,
    jobRole: row.job_role,
    qualification: row.qualification,
    expectedSalary: row.expected_salary,
    finalSalary: row.final_salary,
    iDate: row.interview_date
      ? new Date(row.interview_date).toISOString().split("T")[0]
      : "",
    iTime: row.interview_time || "",
    hrName: row.hr_name,
    hrDesignation: row.hr_designation,
    hrPanel: row.hr_panel,
    hodName: row.hod_name,
    hodDesignation: row.hod_designation,
    hodDepartment: row.hod_department,
    interviewer: {
      name: row.hod_name,
      designation: row.hod_designation,
      department: row.hod_department,
      panel: row.hr_panel,
    },
    roundGrades: expandGrades(row),
    roundComments: [row.comment_round1, row.comment_round2, row.comment_round3],
    verdict: row.verdict,
    hrComments: row.hr_comments,
    overallGrade: row.overall_grade,
    offerLetterPath: row.offer_letter_path || null,
    createdAt: row.created_at,
  };
}

module.exports = { flattenGrades, expandGrades, formatRow };