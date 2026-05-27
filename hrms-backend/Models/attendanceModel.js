const db = require('../config/db');

const AttendanceModel = {

    // সব attendance রেকর্ড আনবে
    getAll: (callback) => {
        const sql = "SELECT * FROM attendance";
        db.query(sql, callback);
    },

};

module.exports = AttendanceModel;