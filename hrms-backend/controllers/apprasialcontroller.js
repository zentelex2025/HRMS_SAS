const db = require('../config/apprasialdb');

// GET all appraisals
exports.getAllAppraisals = (req, res) => {
    const sql = "SELECT * FROM appraisals ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// INSERT new appraisal
exports.createAppraisal = (req, res) => {
    const { employee_name, department, appraisal_date, performance, remarks } = req.body;
    const sql = `INSERT INTO appraisals (employee_name, department, appraisal_date, performance, remarks, status) 
                 VALUES (?, ?, ?, ?, ?, 'Pending')`;
    
    db.query(sql, [employee_name, department, appraisal_date, performance, remarks], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body, status: 'Pending' });
    });
};

// UPDATE status (PATCH)
exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE appraisals SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, status });
    });
};

// DELETE appraisal
exports.deleteAppraisal = (req, res) => {
    db.query("DELETE FROM appraisals WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
};