const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, supervisorController.createSupervisor)
  .get(authAdmin, supervisorController.getSupervisors);

router
  .route('/:supervisorId')
  .get(authAdmin, supervisorController.getSupervisor)
  .patch(authAdmin, supervisorController.updateSupervisor)
  .delete(authAdmin, supervisorController.deleteSupervisor);

module.exports = router;
