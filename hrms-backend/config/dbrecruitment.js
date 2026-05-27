const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recruitment_db',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('DB Error:', err);
    process.exit(1);
  }
  console.log('✅ MySQL Connected');
});

module.exports = db;