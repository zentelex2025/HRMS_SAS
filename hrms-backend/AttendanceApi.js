const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",         // আপনার MySQL user
    password: "",         // আপনার MySQL password
    database: "hrms_db"
});

db.connect((err) => {
    if (err) {
        console.error("❌ DB Connection Failed:", err.message);
        return;
    }
    console.log("✅ Connected to MySQL (hrms_db)");
});

// API to fetch all attendance records
app.get("/api/attendance", (req, res) => {
    db.query("SELECT * FROM attendance ORDER BY attendance_date DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Optional: update status
app.put("/api/attendance/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE attendance SET status=? WHERE attendance_id=?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

const PORT = 5004;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));