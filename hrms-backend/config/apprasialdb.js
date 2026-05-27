const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrms_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Failed:', err.message);
        return;
    }
    console.log('✅ Connected to hrms_db for Appraisals');
});

module.exports = db;