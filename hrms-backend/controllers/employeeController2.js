// employeeController2.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================================================================
// GET /api/employees
// ================================================================
exports.getAllEmployees = (req, res) => {
  // ✅ FIXED: SQL query clean — no JS inside SQL
  const query = `
    SELECT 
      e.*,
      d.name AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    const mapped = results.map(e => {
      let professionalCerts = [];
      let experienceCerts   = [];
      let sonsData          = [];
      let daughtersData     = [];

      try { professionalCerts = e.professional_certs ? JSON.parse(e.professional_certs) : []; } catch (_) {}
      try { experienceCerts   = e.experience_certs   ? JSON.parse(e.experience_certs)   : []; } catch (_) {}
      try { sonsData          = e.sons_data          ? JSON.parse(e.sons_data)          : []; } catch (_) {}
      try { daughtersData     = e.daughters_data     ? JSON.parse(e.daughters_data)     : []; } catch (_) {}

      // ✅ FIXED: education_data duplicate key removed — only one clean version
      let educationDataFixed = "[]";
      try {
        const parsed = e.education_data ? JSON.parse(e.education_data) : [];
        educationDataFixed = JSON.stringify(parsed.map(row => ({
          ...row,
          grade:   row.grade || row.remarks || "",
          remarks: undefined,
        })));
      } catch (_) {}

      return {
        ...e,
        employee_id:         e.employee_code,
        name:                `${e.first_name || ""} ${e.last_name || ""}`.trim() || "N/A",
        fathers_name:        e.father_name        || "N/A",
        mobile_no:           e.phone_no           || "N/A",
        department:          e.department_name    || "General",
        designation:         e.designation        || e.job_role || "Employee",

        // ✅ FIXED: single clean education_data
        education_data:      educationDataFixed,
        professional_data:   e.professional_data  || "[]",
        experience_data:     e.experience_data    || "[]",

        professional_certs:  professionalCerts,
        experience_certs:    experienceCerts,
        sons_data:           JSON.stringify(sonsData),
        daughters_data:      JSON.stringify(daughtersData),

        blood_group:         e.blood_group         || null,
        marital_status:      e.marital_status       || null,
        photo:               e.photo               || null,
        aadhaar:             e.aadhaar_number      || null,
        pan:                 e.pan_number          || null,
        voter:               e.voter_card          || null,
        passport:            e.passport_doc        || null,
        marriage:            e.marriage_cert       || null,
        madhyamik_admit:     e.madhyamik_admit     || null,
        cert_10:             e.marksheet10         || null,
        cert_12:             e.marksheet12         || null,
        grad_certificate:    e.grad_certificate    || null,
        master_certificate:  e.master_certificate  || null,

        // ✅ Family data properly mapped
        fathers_age:         e.fathers_age         || null,
        mothers_name:        e.mothers_name        || null,
        mothers_age:         e.mothers_age         || null,
        spouse_name:         e.spouse_name         || null,
        spouse_age:          e.spouse_age          || null,
        family_address:      e.family_address      || null,
        number_of_sons:      e.number_of_sons      || 0,
        number_of_daughters: e.number_of_daughters || 0,

        // ✅ father_dead / mother_dead — if column exists in DB
        father_dead:         e.father_dead         || 0,
        mother_dead:         e.mother_dead         || 0,

        languages_data:      e.languages_data      || "[]",
        resume:              e.resume              || null,
      };
    });

    res.json({ success: true, data: mapped });
  });
};

// ================================================================
// POST /api/register
// ================================================================
exports.registerEmployee = async (req, res) => {
  try {
    const {
      employeeId, name, fathersName, designation, department,
      email, password, mobileNo, emergencyContact, bloodGroup,
      maritalStatus, presentAddress, permanentAddress,
      highestQualification, extraActivity,
      fathersAge, mothersName, mothersAge,
      spouseName, spouseAge, familyAddress,
      numberOfSons, numberOfDaughters,
      sonsData, daughtersData,
      educationData, professionalData, experienceData,
      languagesData,
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Email, password and name are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nameParts = (name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName  = nameParts.slice(1).join(" ") || "";

    const toPath = (f) => (f ? `/uploads/${f}` : null);

    // ============================
    // 📂 FILES
    // ============================
    const photo             = toPath(req.files?.photo?.[0]?.filename);
    const aadhaar           = toPath(req.files?.aadhaar?.[0]?.filename);
    const pan               = toPath(req.files?.pan?.[0]?.filename);
    const voter             = toPath(req.files?.voter?.[0]?.filename);
    const passport          = toPath(req.files?.passport?.[0]?.filename);
    const marriage          = toPath(req.files?.marriage?.[0]?.filename);
    const madhyamikAdmit    = toPath(req.files?.madhyamikAdmit?.[0]?.filename);
    const cert10            = toPath(req.files?.cert10?.[0]?.filename);
    const cert12            = toPath(req.files?.cert12?.[0]?.filename);
    const gradCertificate   = toPath(req.files?.gradCertificate?.[0]?.filename);
    const masterCertificate = toPath(req.files?.masterCertificate?.[0]?.filename);
    const resume            = toPath(req.files?.resume?.[0]?.filename);

    // ============================
    // 🎓 EDUCATION
    // ============================
    let parsedEducation = [];
    try {
      parsedEducation = educationData ? JSON.parse(educationData) : [];
    } catch (_) {}

    for (let i = 0; i < 20; i++) {
      const file = req.files?.[`educationCert_${i}`]?.[0]?.filename;
      if (parsedEducation[i]) {
        if (parsedEducation[i].remarks && !parsedEducation[i].grade) {
          parsedEducation[i].grade = parsedEducation[i].remarks;
        }
        delete parsedEducation[i].remarks;
        parsedEducation[i].grade = parsedEducation[i].grade || "";
        if (file) parsedEducation[i].fileName = `/uploads/${file}`;
      }
    }

    // ============================
    // 💼 PROFESSIONAL
    // ============================
    let parsedProfessional = [];
    try {
      parsedProfessional = professionalData ? JSON.parse(professionalData) : [];
    } catch (_) {}

    const professionalCerts = [];
    for (let i = 0; i < 20; i++) {
      const file = req.files?.[`professionalCert_${i}`]?.[0]?.filename;
      const certName = req.body[`professionalCertName_${i}`] || `Professional Certificate ${i + 1}`;
      if (file) {
        const filePath = `/uploads/${file}`;
        professionalCerts.push({ name: certName, file: filePath });
        if (parsedProfessional[i]) parsedProfessional[i].fileName = filePath;
      }
    }

    // ============================
    // 🏢 EXPERIENCE
    // ============================
    let parsedExperience = [];
    try {
      parsedExperience = experienceData ? JSON.parse(experienceData) : [];
    } catch (_) {}

    const experienceCerts = [];
    for (let i = 0; i < 20; i++) {
      const file = req.files?.[`experienceCert_${i}`]?.[0]?.filename;
      const certName = req.body[`experienceCertName_${i}`] || `Experience Certificate ${i + 1}`;
      if (file) {
        const filePath = `/uploads/${file}`;
        experienceCerts.push({ name: certName, file: filePath });
        if (parsedExperience[i]) parsedExperience[i].fileName = filePath;
      }
    }

    // ============================
    // 👨‍👩‍👧 FAMILY
    // ============================
    let parsedSons = [], parsedDaughters = [];
    try { parsedSons      = sonsData      ? JSON.parse(sonsData)      : []; } catch (_) {}
    try { parsedDaughters = daughtersData ? JSON.parse(daughtersData) : []; } catch (_) {}

    // ============================
    // 🗄️ INSERT QUERY
    // ============================
   const insertQuery = `
  INSERT INTO employees (
    employee_code, first_name, last_name, email, password,
    designation, phone_no, emergency_contact,
    father_name, blood_group, marital_status,
    present_address, permanent_address,
    highest_qual, extra_curricular,
    photo, aadhaar_number, pan_number, voter_card, passport_doc,
    marriage_cert, madhyamik_admit, marksheet10, marksheet12,
    grad_certificate, master_certificate,
    professional_certs, experience_certs,
    education_data, professional_data, experience_data,
    fathers_age, mothers_name, mothers_age,
    spouse_name, spouse_age, family_address,
    number_of_sons, number_of_daughters,
    sons_data, daughters_data,
    languages_data, resume, status
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;
   const values = [
  employeeId || null,
  firstName, lastName,
  email.trim().toLowerCase(), hashedPassword,
  designation || null,
  mobileNo || null, emergencyContact || null,
  fathersName || null, bloodGroup || null,
  maritalStatus || null,
  presentAddress || null,   // ✅ ADD THIS
  permanentAddress || null,
  highestQualification || null, extraActivity || null,
  photo, aadhaar, pan, voter, passport,
  marriage, madhyamikAdmit, cert10, cert12,
  gradCertificate, masterCertificate,
  JSON.stringify(professionalCerts),
  JSON.stringify(experienceCerts),
  JSON.stringify(parsedEducation),
  JSON.stringify(parsedProfessional),
  JSON.stringify(parsedExperience),
  fathersAge || null, mothersName || null, mothersAge || null,
  spouseName || null, spouseAge || null, familyAddress || null,
  parseInt(numberOfSons) || 0,
  parseInt(numberOfDaughters) || 0,
  JSON.stringify(parsedSons),
  JSON.stringify(parsedDaughters),
  languagesData || "[]",
  resume || null,
  "Active",   // ✅ 44 values total, matches 44 columns
];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Register Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
      res.status(201).json({
        success: true,
        message: "Employee registered successfully",
        employeeId: result.insertId,
      });
    });

  } catch (err) {
    console.error("Register Catch Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================================================
// POST /api/login
// ================================================================
exports.loginEmployee = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({ success: false, message: "Please provide email and password" });

  db.query(
`SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
    [email.trim()],
    async (err, results) => {
      if (err) return res.json({ success: false, message: "Server error: " + err.message });
      if (results.length === 0)
        return res.json({ success: false, message: "Employee not found" });

      const employee = results[0];
      const isHashed = employee.password && employee.password.startsWith("$2");
      let isMatch = false;

      try {
        if (isHashed) {
          isMatch = await bcrypt.compare(password, employee.password);
        } else {
          isMatch = password === employee.password;
          if (isMatch) {
            const hashed = await bcrypt.hash(password, 10);
            db.query(`UPDATE employees SET password = ? WHERE id = ?`, [hashed, employee.id]);
          }
        }
      } catch (bcryptErr) {
        return res.json({ success: false, message: "Password check error" });
      }

      if (!isMatch)
        return res.json({ success: false, message: "Incorrect password" });

      const token = jwt.sign(
        { id: employee.id, email: employee.email },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "1d" }
      );

      const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();

      return res.json({
        success: true,
        message: "Login successful",
        token,
        employee: {
          id:          employee.id,
          name:        fullName,
          email:       employee.email,
          designation: employee.designation || employee.job_role || "Employee",
        },
      });
    }
  );
};

// ================================================================
// PUT /api/change-password
// ================================================================
exports.changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword)
    return res.status(400).json({ success: false, message: "Please fill all fields" });

  db.query(
    `SELECT * FROM employees WHERE LOWER(email) = LOWER(?)`,
    [email.trim()],
    async (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0)
        return res.status(404).json({ success: false, message: "Employee not found" });

      const employee = results[0];
      const isHashed = employee.password && employee.password.startsWith("$2");
      const isMatch  = isHashed
        ? await bcrypt.compare(oldPassword, employee.password)
        : oldPassword === employee.password;

      if (!isMatch)
        return res.status(401).json({ success: false, message: "Old password is incorrect" });

      const hashed = await bcrypt.hash(newPassword, 10);
      db.query(
        `UPDATE employees SET password = ?, must_change_password = 0 WHERE id = ?`,
        [hashed, employee.id],
        (err) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          res.json({ success: true, message: "Password changed successfully" });
        }
      );
    }
  );
};

// ================================================================
// DELETE /api/employees/:id
// ================================================================
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM employees WHERE id = ?`, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, message: "Employee deleted successfully" });
  });
};