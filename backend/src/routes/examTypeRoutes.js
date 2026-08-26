const express = require('express');
const router = express.Router();
const examTypeController = require('../controllers/examTypeController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, examTypeController.createExamType)
  .get(authAdmin, examTypeController.getExamTypes);

router
  .route('/:examTypeId')
  .get(authAdmin, examTypeController.getExamType)
  .patch(authAdmin, examTypeController.updateExamType)
  .delete(authAdmin, examTypeController.deleteExamType);

module.exports = router;
