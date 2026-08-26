const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const studentValidation = require('../validations/studentValidation');
const studentController = require('../controllers/studentController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(studentValidation.createStudent), studentController.createStudent)
  .get(authAdmin, validate(studentValidation.getStudents), studentController.getStudents);

router
  .route('/:studentId')
  .get(authAdmin, validate(studentValidation.getStudent), studentController.getStudent)
  .patch(authAdmin, validate(studentValidation.updateStudent), studentController.updateStudent)
  .delete(authAdmin, validate(studentValidation.deleteStudent), studentController.deleteStudent);

module.exports = router;
