const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const examValidation = require('../validations/examValidation');
const examController = require('../controllers/examController');
const { authAdmin, authStudent, authAny } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(examValidation.createExam), examController.createExam)
  .get(authAny, validate(examValidation.getExams), examController.getExams);

// NEW: Student-only endpoint for enrolled subjects' exams
router.get('/my-exams', authStudent, examController.getMyExams);

router
  .route('/:examId')
  .get(authAny, validate(examValidation.getExam), examController.getExam)
  .patch(authAdmin, validate(examValidation.updateExam), examController.updateExam)
  .delete(authAdmin, validate(examValidation.deleteExam), examController.deleteExam);

router.post('/:examId/assign-halls', authAdmin, validate(examValidation.assignHalls), examController.assignHalls);
router.post('/:examId/auto-assign-seats', authAdmin, examController.autoAssignSeats);
router.post('/:examId/auto-assign-supervisors', authAdmin, examController.autoAssignSupervisors);
router.get('/:examId/details', authAny, examController.getExamDetails);

module.exports = router;