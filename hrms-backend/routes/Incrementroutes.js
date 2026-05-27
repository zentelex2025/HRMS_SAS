// routes/incrementRoutes.js
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/Incrementcontroller');

// POST   /api/increment/apply
router.post('/apply',                  ctrl.apply);

// POST   /api/increment/request
router.post('/request',                ctrl.request);

// GET    /api/increment/requests/pending
router.get('/requests/pending',        ctrl.getPending);

// PUT    /api/increment/request/:id/status
router.put('/request/:id/status',      ctrl.updateStatus);

// GET    /api/increment/history/:employee_code
router.get('/history/:employee_code',  ctrl.getHistory);

module.exports = router;