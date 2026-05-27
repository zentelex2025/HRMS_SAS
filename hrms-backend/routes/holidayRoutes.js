const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidaycontroller');

// Routes mapping
router.get('/holidays', holidayController.getHolidays);
router.post('/holidays', holidayController.addHoliday);
router.delete('/holidays/:id', holidayController.deleteHoliday);

module.exports = router;