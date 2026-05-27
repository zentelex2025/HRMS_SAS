// ─────────────────────────────────────────────────────────────────────────────
// onboarding.js  —  Node.js + Express + MySQL (hrms_db)
// Install:  npm install express mysql2 cors bcryptjs jsonwebtoken multer
// Run:      node onboarding.js
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const mysql   = require("mysql2/promise");
const cors    = require("cors");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const app        = express();
const PORT       = 3002;
const JWT_SECRET = "HR_ONBOARDING_SECRET_2026";

// ── Upload folder ─────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const u = Date.now() + "_" + Math.round(Math.random() * 1e6);
    cb(null, u + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// ── Serve uploaded files with correct Content-Type & CORS headers ─────────────
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(UPLOAD_DIR));

// ── MySQL pool — hrms_db ──────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:               "localhost",
  user:               "root",
  password:           "",
  database:           "hrms_db",
  waitForConnections: true,
  connectionLimit:    10,
});

// ── JWT middleware ────────────────────────────────────────────────────────────
function authHR(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "No token — HR login required" });
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — HR Login
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username ও password দিন" });
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM ob_hr_users WHERE username = ? AND is_active = 1",
      [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, rows[0].password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username, fullName: rows[0].full_name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token, fullName: rows[0].full_name, username: rows[0].username });
  } catch (e) {
    res.status(500).json({ error: "DB error: " + e.message });
  }
});

app.post("/api/auth/create-hr", authHR, async (req, res) => {
  const { username, password, full_name } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username ও password দিন" });
  const hashed = await bcrypt.hash(password, 10);
  try {
    await pool.execute(
      "INSERT INTO ob_hr_users (username, password, full_name) VALUES (?, ?, ?)",
      [username, hashed, full_name || ""]
    );
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Username already exists" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MODULE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_LABELS = {
  hr:"HR Training", culture:"Company Culture & Values", payroll:"Payroll & Leave Policy",
  posh:"POSH & Code of Conduct", pos:"POS Training", dept:"Department Training",
  floor:"Floor / Store Training", grooming:"Grooming & Uniform",
  compliance:"Compliance & Policy", it_security:"IT Security & Cyber Safety",
  behavioral:"Behavioral Standard", product:"Product Knowledge",
  customer:"Customer Service", communication:"Communication Skills",
  softskills:"Soft Skills", billing:"Billing Training",
  merchandising:"Visual Merchandising", inventory:"Inventory & Stock Take",
  sales_tech:"Upselling Techniques", market_trend:"Market Trends & Insights",
  safety:"Safety Training", fire:"Fire Safety & Evacuation",
  firstaid:"First Aid Training", ojt:"OJT", loss_prev:"Loss Prevention",
  emergency:"Emergency Response Plan", health_hygiene:"Health & Hygiene",
  first_aid_adv:"Advanced First Aid", waste_mgmt:"Waste & Environment",
};
const MODULE_GROUP = {
  hr:"induction", culture:"induction", payroll:"induction", posh:"induction",
  pos:"induction", dept:"induction", floor:"induction", grooming:"induction",
  compliance:"induction", it_security:"induction", behavioral:"induction",
  product:"product", customer:"product", communication:"product", softskills:"product",
  billing:"product", merchandising:"product", inventory:"product",
  sales_tech:"product", market_trend:"product",
  safety:"safety", fire:"safety", firstaid:"safety", ojt:"safety",
  loss_prev:"safety", emergency:"safety", health_hygiene:"safety",
  first_aid_adv:"safety", waste_mgmt:"safety",
};

// ─────────────────────────────────────────────────────────────────────────────
// ── HELPER: Build multer fields for onboarding upload ────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_KEYS = Object.keys(MODULE_LABELS);
const onboardingFields = upload.fields([
  { name: "id_card_image", maxCount: 1 },
  ...MODULE_KEYS.map(k => ({ name: `questions_${k}`, maxCount: 1 })),
  ...MODULE_KEYS.map(k => ({ name: `result_${k}`,    maxCount: 1 })),
  ...Array.from({ length: 50 }, (_, i) => ({ name: `doc_${i}`, maxCount: 1 })),
]);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trainers  — সব active trainers fetch করুন
// ─────────────────────────────────────────────────────────────────────────────
app.get("/api/trainers", authHR, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, department FROM ob_trainers WHERE is_active = 1 ORDER BY name ASC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/trainers  — নতুন trainer যোগ করুন
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/trainers", authHR, async (req, res) => {
  const { name, department } = req.body;
  if (!name) return res.status(400).json({ error: "Trainer name required" });
  try {
    // Already exists? Just re-activate
    const [ex] = await pool.execute(
      "SELECT id FROM ob_trainers WHERE name = ? AND department = ?",
      [name, department || ""]
    );
    if (ex.length > 0) {
      await pool.execute("UPDATE ob_trainers SET is_active = 1 WHERE id = ?", [ex[0].id]);
      return res.json({ success: true, id: ex[0].id });
    }
    const [r] = await pool.execute(
      "INSERT INTO ob_trainers (name, department, is_active) VALUES (?, ?, 1)",
      [name, department || ""]
    );
    res.json({ success: true, id: r.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/trainers/:id  — trainer নিষ্ক্রিয় করুন
// ─────────────────────────────────────────────────────────────────────────────
app.delete("/api/trainers/:id", authHR, async (req, res) => {
  try {
    await pool.execute("UPDATE ob_trainers SET is_active = 0 WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/onboarding  — multipart/form-data
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/onboarding", authHR, onboardingFields, async (req, res) => {
  let payload;
  try {
    payload = JSON.parse(req.body.data || "{}");
  } catch {
    return res.status(400).json({ error: "Invalid JSON in 'data' field" });
  }

  const { emp, modules, trainers, passConfig, docs } = payload;
  if (!emp?.name) return res.status(400).json({ error: "Employee name required" });

  const files = req.files || {};
  const idCardFile     = files["id_card_image"]?.[0];
  const idCardFilename = idCardFile ? idCardFile.filename : null;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const checklist = JSON.stringify({
      lunch:       emp.checklist_lunch       || false,
      stationary:  emp.checklist_stationary  || false,
      laptop:      emp.checklist_laptop      || false,
      workstation: emp.checklist_workstation || false,
      credentials: emp.checklist_credentials || false,
    });

    const [empR] = await conn.execute(
      `INSERT INTO ob_employees
         (name, email, phone, address, father_name, mother_name,
          department, designation, employee_code, id_status,
          joining_date, checklist, id_card_image_url, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        emp.name, emp.email||null, emp.phone||null, emp.address||null,
        emp.father||null, emp.mother||null, emp.department||null,
        emp.designation||null, emp.employeeId||null,
        emp.idStatus||"Not issued", emp.joiningDate||null,
        checklist, idCardFilename, req.user.id,
      ]
    );
    const empId = empR.insertId;

    if (passConfig) {
      await conn.execute(
        "UPDATE ob_pass_config SET pass_mark=?, max_marks=?, reattempt=? WHERE id=1",
        [passConfig.passMark||70, passConfig.maxMarks||100, passConfig.reattempt||"Yes"]
      );
    }

    // ── Trainers sync করুন ob_trainers table এ ──
    if (trainers?.length) {
      await conn.execute("UPDATE ob_trainers SET is_active=0");
      for (const t of trainers) {
        if (!t.name) continue;
        const [ex] = await conn.execute(
          "SELECT id FROM ob_trainers WHERE name=? AND department=?",
          [t.name, t.dept||""]
        );
        if (ex.length > 0) {
          await conn.execute("UPDATE ob_trainers SET is_active=1 WHERE id=?", [ex[0].id]);
        } else {
          await conn.execute(
            "INSERT INTO ob_trainers (name, department, is_active) VALUES (?,?,1)",
            [t.name, t.dept||""]
          );
        }
      }
    }

    if (modules) {
      for (const [key, m] of Object.entries(modules)) {
        const qFile = files[`questions_${key}`]?.[0];
        const rFile = files[`result_${key}`]?.[0];
        const questionsFilename = qFile ? qFile.filename : (m.questions  || null);
        const resultFilename    = rFile ? rFile.filename : (m.resultSheet || null);
        const questionsOriginal = qFile ? qFile.originalname : (m.questions  || null);
        const resultOriginal    = rFile ? rFile.originalname : (m.resultSheet || null);

        await conn.execute(
          `INSERT INTO ob_training_modules
             (employee_id, module_key, module_label, module_group,
              training_dates, trainer_name, marks, max_marks, pass_mark,
              mandatory, questions_file, questions_original,
              result_file, result_original)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
           ON DUPLICATE KEY UPDATE
             training_dates=VALUES(training_dates), trainer_name=VALUES(trainer_name),
             marks=VALUES(marks), max_marks=VALUES(max_marks), pass_mark=VALUES(pass_mark),
             mandatory=VALUES(mandatory),
             questions_file=VALUES(questions_file), questions_original=VALUES(questions_original),
             result_file=VALUES(result_file), result_original=VALUES(result_original)`,
          [
            empId, key, MODULE_LABELS[key]||key, MODULE_GROUP[key]||"induction",
            JSON.stringify(m.dates||[]), m.trainer||null,
            m.marks ? Number(m.marks) : null,
            passConfig?.maxMarks||100, passConfig?.passMark||70,
            m.mandatory ? 1 : 0,
            questionsFilename, questionsOriginal,
            resultFilename,    resultOriginal,
          ]
        );
      }
    }

    if (docs?.length) {
      for (let i = 0; i < docs.length; i++) {
        const d = docs[i];
        const docFile     = files[`doc_${i}`]?.[0];
        const docFilename = docFile ? docFile.filename : d.file;
        const docOriginal = docFile ? docFile.originalname : d.file;
        await conn.execute(
          "INSERT INTO ob_documents (employee_id, title, category, file_name, stored_name) VALUES (?,?,?,?,?)",
          [empId, d.title||d.file, d.cat||"General", docOriginal, docFilename]
        );
      }
    }

    await conn.commit();
    res.json({ success: true, id: empId });

  } catch (e) {
    await conn.rollback();
    console.error("❌ DB Error:", e.message);
    res.status(500).json({ error: "DB error: " + e.message });
  } finally {
    conn.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/onboarding
// ─────────────────────────────────────────────────────────────────────────────
app.get("/api/onboarding", authHR, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.id, e.name, e.email, e.department, e.designation,
              e.employee_code, e.id_status, e.joining_date, e.created_at,
              e.id_card_image_url,
              s.passed_modules, s.failed_modules, s.avg_score_pct,
              s.mandatory_uploads_missing
       FROM ob_employees e
       LEFT JOIN ob_view_training_summary s ON s.employee_id = e.id
       ORDER BY e.created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/onboarding/:id
// ─────────────────────────────────────────────────────────────────────────────
app.get("/api/onboarding/:id", authHR, async (req, res) => {
  try {
    const [[emp]]    = await pool.execute("SELECT * FROM ob_employees WHERE id=?", [req.params.id]);
    if (!emp) return res.status(404).json({ error: "Not found" });
    const [mods]     = await pool.execute("SELECT * FROM ob_training_modules WHERE employee_id=?", [req.params.id]);
    const [docs]     = await pool.execute("SELECT * FROM ob_documents WHERE employee_id=?", [req.params.id]);
    const [[cfg]]    = await pool.execute("SELECT * FROM ob_pass_config WHERE id=1");
    const [trainers] = await pool.execute("SELECT * FROM ob_trainers WHERE is_active=1 ORDER BY name ASC");
    res.json({ employee: emp, modules: mods, docs, passConfig: cfg, trainers });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/onboarding/:id
// ─────────────────────────────────────────────────────────────────────────────
app.delete("/api/onboarding/:id", authHR, async (req, res) => {
  try {
    const [mods] = await pool.execute(
      "SELECT questions_file, result_file FROM ob_training_modules WHERE employee_id=?",
      [req.params.id]
    );
    const [[emp]] = await pool.execute(
      "SELECT id_card_image_url FROM ob_employees WHERE id=?",
      [req.params.id]
    );
    const filesToDelete = [];
    if (emp?.id_card_image_url) filesToDelete.push(emp.id_card_image_url);
    mods.forEach(m => {
      if (m.questions_file) filesToDelete.push(m.questions_file);
      if (m.result_file)    filesToDelete.push(m.result_file);
    });
    filesToDelete.forEach(fname => {
      const fp = path.join(UPLOAD_DIR, fname);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
    await pool.execute("DELETE FROM ob_employees WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload  — single file upload
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/upload", authHR, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  res.json({
    filename:     req.file.filename,
    originalname: req.file.originalname,
    url:          `/uploads/${req.file.filename}`,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────────────────────────────────
pool.getConnection()
  .then(conn => {
    conn.release();
    console.log("✅ MySQL connected  →  hrms_db");
    app.listen(PORT, () => {
      console.log(`\n🚀 Onboarding API  →  http://localhost:${PORT}`);
      console.log(`   🔐 Login:  admin / admin123`);
      console.log(`   📁 Files:  http://localhost:${PORT}/uploads/<filename>`);
      console.log(`   ⚠  Only HR Manager can access\n`);
    });
  })
  .catch(err => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  });