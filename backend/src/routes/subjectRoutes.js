const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const subjectValidation = require('../validations/subjectValidation');
const subjectController = require('../controllers/subjectController');
const { authAdmin, authAny } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(subjectValidation.createSubject), subjectController.createSubject)
  .get(authAny, validate(subjectValidation.getSubjects), subjectController.getSubjects);

router
  .route('/:subjectId')
  .get(authAny, validate(subjectValidation.getSubject), subjectController.getSubject)
  .patch(authAdmin, validate(subjectValidation.updateSubject), subjectController.updateSubject)
  .delete(authAdmin, validate(subjectValidation.deleteSubject), subjectController.deleteSubject);

module.exports = router;