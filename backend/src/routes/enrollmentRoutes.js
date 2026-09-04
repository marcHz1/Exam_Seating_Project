const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const enrollmentValidation = require('../validations/enrollmentValidation');
const enrollmentController = require('../controllers/enrollmentController');
const { authAdmin, authStudent } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(enrollmentValidation.createEnrollment), enrollmentController.createEnrollment)
  .get(authAdmin, validate(enrollmentValidation.getEnrollments), enrollmentController.getEnrollments);

router.get('/my-enrollments', authStudent, enrollmentController.getMyEnrollments);

router
  .route('/:enrollmentId')
  .get(authAdmin, validate(enrollmentValidation.getEnrollment), enrollmentController.getEnrollment)
  .patch(authAdmin, validate(enrollmentValidation.updateEnrollment), enrollmentController.updateEnrollment)
  .delete(authAdmin, validate(enrollmentValidation.deleteEnrollment), enrollmentController.deleteEnrollment);

module.exports = router;
