import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hrms_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Error: " + err.message);
    return;
  }
  console.log("Connected to MySQL database on Port 5019");
});

module.exports = db;
