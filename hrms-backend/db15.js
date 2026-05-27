import mysql from "mysql2";
const db = mysql.createPool({
  host: "Localhost",
  user: "root",
  password: "",
  database: "hrmms_db",
});
module.exports = db;
