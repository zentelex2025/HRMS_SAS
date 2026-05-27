const db = require('../config/holidaydb');

// সব ছুটি দেখা (GET)
exports.getHolidays = (req, res) => {
    const sql = "SELECT * FROM holidays ORDER BY date ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// নতুন ছুটি যোগ করা (POST)
exports.addHoliday = (req, res) => {
    const { name, date, type } = req.body;
    const sql = "INSERT INTO holidays (name, date, type) VALUES (?, ?, ?)";
    db.query(sql, [name, date, type], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Success", id: result.insertId });
    });
};

// ডিলিট করা (DELETE)
exports.deleteHoliday = (req, res) => {
    const sql = "DELETE FROM holidays WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
};