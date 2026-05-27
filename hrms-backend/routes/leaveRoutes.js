const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/leaveController');

router.get('/leaves',              ctrl.getAllLeaves);
router.post('/apply-leave',        ctrl.applyLeave);
router.post('/leave-status',       ctrl.updateLeaveStatus);
router.delete('/leave-delete/:id', ctrl.deleteLeave);

module.exports = router;