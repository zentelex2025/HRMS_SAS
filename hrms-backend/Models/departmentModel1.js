// models/departmentModel.js
const db = require("../config/db");

const getAll = (callback) => {
  db.query("SELECT * FROM departments ORDER BY name ASC", callback);
};

module.exports = { getAll };