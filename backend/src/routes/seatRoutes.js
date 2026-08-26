const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .get(authAdmin, seatController.getSeats);

router
  .route('/:seatId')
  .get(authAdmin, seatController.getSeat)
  .patch(authAdmin, seatController.updateSeat);

module.exports = router;
