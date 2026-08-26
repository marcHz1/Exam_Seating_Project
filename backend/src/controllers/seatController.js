const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const seatService = require('../services/seatService');

const getSeats = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['hall_id', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await seatService.querySeats(filter, options);
  res.json({ success: true, data: result });
});

const getSeat = catchAsync(async (req, res) => {
  const seat = await seatService.getSeatById(req.params.seatId);
  if (!seat) return res.status(404).json({ success: false, message: 'Seat not found' });
  res.json({ success: true, data: seat });
});

const updateSeat = catchAsync(async (req, res) => {
  const seat = await seatService.updateSeatById(req.params.seatId, req.body);
  res.json({ success: true, data: seat });
});

module.exports = {
  getSeats,
  getSeat,
  updateSeat,
};
