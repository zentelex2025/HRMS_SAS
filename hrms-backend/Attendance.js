const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── DB Connection ─────────────────────────────────────────
const db = mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'hrms_db',
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    }
    console.log('✅ MySQL Connected');
});

// ── GET /api/attendance ───────────────────────────────────
app.get('/api/attendance', (req, res) => {
    const sql = "SELECT * FROM attendance";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const formattedData = results.map(item => ({
            _id:      item.id,
            userId:   { name: item.employee_name || "Unknown" },
            date:     item.date
                        ? new Date(item.date).toISOString().split('T')[0]
                        : "N/A",
            checkIn:  item.check_in  || "--",
            checkOut: item.check_out || "--",
            lateCount: item.late_count || 0,
            status:   item.status || "Present",
        }));

        res.json(formattedData);
    });
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5011;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
});