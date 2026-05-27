const express = require('express');
const router  = express.Router();
const AttendanceController = require('../controllers/attendanceController1');

router.get('/', AttendanceController.getAll);

module.exports = router;