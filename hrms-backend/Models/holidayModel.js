const db = require('../config/db');

// GET all holidays
const getAllHolidays = (callback) => {
    const sql = "SELECT * FROM holidays ORDER BY date ASC";
    db.query(sql, callback);
};

// INSERT holiday
const addHoliday = (data, callback) => {
    const sql = "INSERT INTO holidays (name, date, type) VALUES (?, ?, ?)";
    db.query(sql, [data.name, data.date, data.type], callback);
};

// DELETE holiday
const deleteHoliday = (id, callback) => {
    const sql = "DELETE FROM holidays WHERE id = ?";
    db.query(sql, [id], callback);
};

module.exports = {
    getAllHolidays,
    addHoliday,
    deleteHoliday
};