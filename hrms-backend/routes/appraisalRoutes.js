const express = require('express');
const router = express.Router();
const appraisalController = require('../controllers/apprasialcontroller ');

router.get('/appraisals', appraisalController.getAllAppraisals);
router.post('/appraisals', appraisalController.createAppraisal);
router.patch('/appraisals/:id/status', appraisalController.updateStatus);
router.delete('/appraisals/:id', appraisalController.deleteAppraisal);

module.exports = router;