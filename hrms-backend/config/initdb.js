// config/initDb.js — Run once at startup to create tables

const pool = require("./db11");

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assessments (
      id INT AUTO_INCREMENT PRIMARY KEY,

      -- Candidate
      candidate_name VARCHAR(200),
      designation    VARCHAR(200),
      applied_role   VARCHAR(200),
      job_role       VARCHAR(200),
      qualification  VARCHAR(200),
      expected_salary VARCHAR(100),
      final_salary    VARCHAR(100),
      interview_date  DATE,
      interview_time  TIME,

      -- HR person (Round 1)
      hr_name        VARCHAR(200),
      hr_designation VARCHAR(200),
      hr_panel       VARCHAR(200),

      -- HOD (Round 2 & 3 interviewer)
      hod_name        VARCHAR(200),
      hod_designation VARCHAR(200),
      hod_department  VARCHAR(200),

      -- Round 1 — HR grades
      grade_personality  CHAR(1),
      grade_english      CHAR(1),
      grade_behaviour    CHAR(1),
      grade_communication CHAR(1),
      grade_cultural     CHAR(1),

      -- Round 2 — Technical grades (HOD)
      grade_domain     CHAR(1),
      grade_analytical CHAR(1),
      grade_technical  CHAR(1),
      grade_problem    CHAR(1),
      grade_aptitude   CHAR(1),

      -- Round 3 — Final grades (HOD)
      grade_leadership  CHAR(1),
      grade_teamwork    CHAR(1),
      grade_strategic   CHAR(1),
      grade_motivation  CHAR(1),
      grade_overall_imp CHAR(1),

      -- Comments per round
      comment_round1 TEXT,
      comment_round2 TEXT,
      comment_round3 TEXT,

      -- Summary
      verdict       VARCHAR(50),
      hr_comments   TEXT,
      overall_grade CHAR(1),

      -- Offer letter PDF (filename only)
      offer_letter_path VARCHAR(500),

      created_at DATETIME DEFAULT NOW(),
      updated_at DATETIME DEFAULT NOW() ON UPDATE NOW()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("✅  Table `assessments` ready");
}

module.exports = initDb;