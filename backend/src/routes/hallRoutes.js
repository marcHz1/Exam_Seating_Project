const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const hallValidation = require('../validations/hallValidation');
const hallController = require('../controllers/hallController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(hallValidation.createHall), hallController.createHall)
  .get(authAdmin, validate(hallValidation.getHalls), hallController.getHalls);

router
  .route('/:hallId')
  .get(authAdmin, validate(hallValidation.getHall), hallController.getHall)
  .patch(authAdmin, validate(hallValidation.updateHall), hallController.updateHall)
  .delete(authAdmin, validate(hallValidation.deleteHall), hallController.deleteHall);

router
  .route('/:hallId/seats')
  .get(authAdmin, hallController.getHallSeats);

module.exports = router;
