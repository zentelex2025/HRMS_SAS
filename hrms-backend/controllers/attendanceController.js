const db = require('../config/db');

const saveAttendance = (req, res) => {
    const attendanceData = req.body;

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        return res.status(400).json({ error: "No data received" });
    }

    const sql = `INSERT INTO employee1 
    (date, employee_id, employee_name, shift_name, start_time, end_time, check_in, check_out, work_hours, status) 
    VALUES ?
    ON DUPLICATE KEY UPDATE
        employee_name = VALUES(employee_name),
        shift_name    = VALUES(shift_name),
        check_in      = VALUES(check_in),
        check_out     = VALUES(check_out),
        work_hours    = VALUES(work_hours),
        status        = VALUES(status)`;

    const values = attendanceData.map(item => [
        item.attendance_date || item.date,
        item.employee_id,
        item.employee_name,
        item.shift_name || 'General',
        item.start_time || null,
        item.end_time || null,
        item.check_in || null,
        item.check_out || null,
        item.work_hours ? parseFloat(item.work_hours) : 0,
        item.status || 'Absent'
    ]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({
                error: "Failed to save data to database.",
                details: err.message
            });
        }
        res.status(200).json({
            message: `${result.affectedRows} records saved successfully!`
        });
    });
};

const viewAttendance = (req, res) => {
    const sql = "SELECT * FROM employee1 ORDER BY date DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("View Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

const checkTable = (req, res) => {
    db.query("DESCRIBE employee1", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = { saveAttendance, viewAttendance, checkTable };