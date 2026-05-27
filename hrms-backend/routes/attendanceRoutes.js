const express = require('express');
const router  = express.Router();
const {
    saveAttendance,
    viewAttendance,
    checkTable
} = require('../controllers/attendanceController');

router.post('/save-attendance', saveAttendance);
router.get('/view-attendance', viewAttendance);
router.get('/check-table',     checkTable);

module.exports = router;