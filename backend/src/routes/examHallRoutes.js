const express = require('express');
const router = express.Router();
const examHallController = require('../controllers/examHallController');
const { authAdmin, authSupervisor, authAny } = require('../middleware/auth');

router
  .route('/')
  .get(authAny, examHallController.getExamHalls);  // ← was authAdmin

router
  .route('/:examHallId')
  .get(authSupervisor, examHallController.getExamHall)
  .delete(authAdmin, examHallController.deleteExamHall);

module.exports = router;