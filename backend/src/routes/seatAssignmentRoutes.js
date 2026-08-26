const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const seatAssignmentValidation = require('../validations/seatAssignmentValidation');
const seatAssignmentController = require('../controllers/seatAssignmentController');
const { authAdmin, authStudent, authSupervisor, authAny } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(seatAssignmentValidation.createSeatAssignment), seatAssignmentController.createSeatAssignment)
  .get(authAny, validate(seatAssignmentValidation.getSeatAssignments), seatAssignmentController.getSeatAssignments);

// Student can view their own assignments — now uses dedicated controller
router.get('/my-assignments', authStudent, seatAssignmentController.getMySeatAssignments);

router
  .route('/:seatAssignmentId')
  .get(authAny, validate(seatAssignmentValidation.getSeatAssignment), seatAssignmentController.getSeatAssignment)
  .patch(authSupervisor, validate(seatAssignmentValidation.updateAttendance), seatAssignmentController.updateAttendance)
  .delete(authAdmin, validate(seatAssignmentValidation.deleteSeatAssignment), seatAssignmentController.deleteSeatAssignment);

module.exports = router;