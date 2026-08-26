const express = require('express');
const router = express.Router();
const supervisorAssignmentController = require('../controllers/supervisorAssignmentController');
const { authAdmin, authSupervisor, authAny } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, supervisorAssignmentController.createSupervisorAssignment)
  .get(authAny, supervisorAssignmentController.getSupervisorAssignments);

// NEW: Supervisor can view only their own assignments
router.get('/my-assignments', authSupervisor, supervisorAssignmentController.getMySupervisorAssignments);

router
  .route('/:assignmentId')
  .get(authSupervisor, supervisorAssignmentController.getSupervisorAssignment)
  .patch(authAdmin, supervisorAssignmentController.updateSupervisorAssignment)
  .delete(authAdmin, supervisorAssignmentController.deleteSupervisorAssignment);

module.exports = router;