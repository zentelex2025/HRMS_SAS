const express = require('express');
const router = express.Router();
const {
  notifyHr,
  saveRecruitment,
  getAllRecruitments,
  getRecruitmentById
} = require('../controllers/recruitmentController');

router.post('/notify-hr', notifyHr);
router.post('/save', saveRecruitment);
router.get('/all', getAllRecruitments);
router.get('/:id', getRecruitmentById);

module.exports = router;