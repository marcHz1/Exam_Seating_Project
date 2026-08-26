const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const examValidation = require('../validations/examValidation');
const examController = require('../controllers/examController');
const { authAdmin, authAny } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(examValidation.createExam), examController.createExam)
  .get(authAny, validate(examValidation.getExams), examController.getExams);

// Specific routes MUST come before /:examId
router.get('/:examId/details', authAny, examController.getExamDetails);

router
  .route('/:examId/assign-halls')
  .post(authAdmin, validate(examValidation.assignHalls), examController.assignHalls);

router
  .route('/:examId/auto-assign-seats')
  .post(authAdmin, validate(examValidation.autoAssignSeats), examController.autoAssignSeats);

router
  .route('/:examId/auto-assign-supervisors')
  .post(authAdmin, validate(examValidation.autoAssignSupervisors), examController.autoAssignSupervisors);

router
  .route('/:examId')
  .get(authAny, validate(examValidation.getExam), examController.getExam)
  .patch(authAdmin, validate(examValidation.updateExam), examController.updateExam)
  .delete(authAdmin, validate(examValidation.deleteExam), examController.deleteExam);

module.exports = router;