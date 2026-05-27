const db = require('../config/dbrecruitment');
const formatDate = require('../utils/formatDate');
const sendHrEmail = require('../utils/mailer');

// ====================== NOTIFY HR ======================
const notifyHr = async (req, res) => {
  try {
    const { hrEmail, hrName, department, recruitmentId, designations = [], dateOfHiring, jobRole } = req.body;
    if (!hrEmail) return res.json({ success: false, message: 'HR email required' });

    await sendHrEmail({ hrEmail, hrName, department, recruitmentId, designations, dateOfHiring, jobRole });
    res.json({ success: true, message: `Email sent to ${hrEmail}` });

  } catch (err) {
    console.error('❌ Email Error:', err);
    res.json({ success: false, message: err.message });
  }
};

// ====================== SAVE ======================
const saveRecruitment = async (req, res) => {
  try {
    const {
      department, dateOfHiring, experience, totalBudget, cycle, jobRole,
      designations = [], hrList = [], interviews = [], employees = [], cvList = []
    } = req.body;

    const [result] = await db.promise().query(
      `INSERT INTO recruitment_main (department, date_of_hiring, experience, total_budget, cycle, job_role, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [department, formatDate(dateOfHiring), experience, totalBudget, cycle, jobRole]
    );

    const recruitmentId = result.insertId;
    const promises = [];

    designations.forEach(d => {
      promises.push(db.promise().query(
        `INSERT INTO designations (recruitment_id, title, min_qual, salary) VALUES (?, ?, ?, ?)`,
        [recruitmentId, d.title, d.minQual || '', d.salary || 0]
      ));
    });

    hrList.forEach(hr => {
      promises.push(db.promise().query(
        `INSERT INTO hr_managers (recruitment_id, name, email, tentative_joining_date) VALUES (?, ?, ?, ?)`,
        [recruitmentId, hr.name, hr.email, formatDate(hr.tentativeJoiningDate)]
      ));
    });

    interviews.forEach(iv => {
      promises.push(db.promise().query(
        `INSERT INTO interviews 
        (recruitment_id, candidate_name, designation, department, date_of_interview, time_of_interview, remarks, remarks_required, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [recruitmentId, iv.candidateName, iv.designation, iv.department || '',
         formatDate(iv.dateOfInterview), iv.timeOfInterview || '',
         iv.remarks || '', iv.remarksRequired || 'Yes', iv.status || 'Scheduled']
      ));
    });

    employees.forEach(emp => {
      promises.push(db.promise().query(
        `INSERT INTO employees (recruitment_id, designation, basic_salary, hra, allowance, total_salary) VALUES (?, ?, ?, ?, ?, ?)`,
        [recruitmentId, emp.designation, emp.salary?.basic || 0, emp.salary?.hra || 0,
         emp.salary?.allowance || 0, emp.salary?.total || 0]
      ));
    });

    for (const cv of cvList) {
      const [cvResult] = await db.promise().query(
        `INSERT INTO cv_uploads (recruitment_id, file_name, designation, status, shortlisted, uploaded_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [recruitmentId, cv.name || 'Unnamed CV', cv.designation, cv.status || 'Pending',
         cv.shortlisted ? 1 : 0, new Date().toISOString().slice(0, 19).replace('T', ' ')]
      );
      if (cv.notes?.length > 0) {
        const noteValues = cv.notes.map(n => [cvResult.insertId, recruitmentId, n.text, n.by || 'HR', n.time || '']);
        await db.promise().query(
          `INSERT INTO cv_notes (cv_id, recruitment_id, note_text, noted_by, noted_time) VALUES ?`,
          [noteValues]
        );
      }
    }

    await Promise.all(promises);
    res.json({ success: true, id: recruitmentId });

  } catch (err) {
    console.error('❌ ERROR:', err);
    res.json({ success: false, message: err.message });
  }
};

// ====================== GET ALL ======================
const getAllRecruitments = (req, res) => {
  db.query(`SELECT * FROM recruitment_main ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true, data: rows });
  });
};

// ====================== GET ONE ======================
const getRecruitmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const [main] = await db.promise().query(`SELECT * FROM recruitment_main WHERE id = ?`, [id]);
    if (main.length === 0) return res.json({ success: false, message: 'Not found' });

    const [designations] = await db.promise().query(`SELECT * FROM designations WHERE recruitment_id = ?`, [id]);

    const [hrListRaw] = await db.promise().query(`SELECT * FROM hr_managers WHERE recruitment_id = ?`, [id]);
    const hrList = hrListRaw.map(hr => {
      let joiningDate = null;
      if (hr.tentative_joining_date) {
        const raw = hr.tentative_joining_date;
        if (raw instanceof Date) {
          const offset = raw.getTimezoneOffset();
          const corrected = new Date(raw.getTime() - offset * 60 * 1000);
          joiningDate = corrected.toISOString().split('T')[0];
        } else {
          joiningDate = String(raw).split('T')[0];
        }
      }
      return { ...hr, tentativeJoiningDate: joiningDate, tentative_joining_date: joiningDate };
    });

    const [interviews] = await db.promise().query(`SELECT * FROM interviews WHERE recruitment_id = ?`, [id]);
    const [employees] = await db.promise().query(`SELECT * FROM employees WHERE recruitment_id = ?`, [id]);
    const [cvUploads] = await db.promise().query(`SELECT * FROM cv_uploads WHERE recruitment_id = ?`, [id]);

    const cvList = [];
    for (const cv of cvUploads) {
      const [notes] = await db.promise().query(`SELECT * FROM cv_notes WHERE cv_id = ?`, [cv.id]);
      cvList.push({ ...cv, notes: notes.map(n => ({ text: n.note_text, by: n.noted_by, time: n.noted_time })) });
    }

    res.json({ success: true, data: { ...main[0], designations, hrList, interviews, employees, cvList } });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

module.exports = { notifyHr, saveRecruitment, getAllRecruitments, getRecruitmentById };