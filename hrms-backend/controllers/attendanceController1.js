const AttendanceModel = require('../Models/attendanceModel');

const AttendanceController = {

    // GET /api/attendance
    getAll: (req, res) => {
        AttendanceModel.getAll((err, results) => {
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
    },

};

module.exports = AttendanceController;