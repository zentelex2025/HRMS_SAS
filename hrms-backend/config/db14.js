const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hrms_db",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed!", err.message);
    return;
  }
  console.log("MySQL connected!");
});

module.exports = db;