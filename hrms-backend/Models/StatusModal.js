// models/statsModel.js
const db = require("../config/db");

const getSummary = (callback) => {
  const sql = `
    SELECT
      COUNT(*)                                          AS total,
      SUM(status = 'Active')                           AS active,
      SUM(status = 'On Leave')                         AS on_leave,
      SUM(status = 'Inactive')                         AS inactive,
      ROUND(AVG(NULLIF(performance, 0)), 1)            AS avg_performance
    FROM employees
  `;
  db.query(sql, callback);
};

module.exports = { getSummary };