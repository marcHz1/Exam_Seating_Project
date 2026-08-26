const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const semesterValidation = require('../validations/semesterValidation');
const semesterController = require('../controllers/semesterController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(semesterValidation.createSemester), semesterController.createSemester)
  .get(authAdmin, validate(semesterValidation.getSemesters), semesterController.getSemesters);

router
  .route('/:semesterId')
  .get(authAdmin, validate(semesterValidation.getSemester), semesterController.getSemester)
  .patch(authAdmin, validate(semesterValidation.updateSemester), semesterController.updateSemester)
  .delete(authAdmin, validate(semesterValidation.deleteSemester), semesterController.deleteSemester);

module.exports = router;
