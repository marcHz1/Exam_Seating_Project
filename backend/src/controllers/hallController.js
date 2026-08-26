const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const hallService = require('../services/hallService');

const createHall = catchAsync(async (req, res) => {
  const hall = await hallService.createHall(req.body);
  res.status(201).json({ success: true, data: hall });
});

const getHalls = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['building_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await hallService.queryHalls(filter, options);
  res.json({ success: true, data: result });
});

const getHall = catchAsync(async (req, res) => {
  const hall = await hallService.getHallById(req.params.hallId);
  if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' });
  res.json({ success: true, data: hall });
});

const getHallSeats = catchAsync(async (req, res) => {
  const result = await hallService.getHallSeats(req.params.hallId);
  res.json({ success: true, data: result });
});

const updateHall = catchAsync(async (req, res) => {
  const hall = await hallService.updateHallById(req.params.hallId, req.body);
  res.json({ success: true, data: hall });
});

const deleteHall = catchAsync(async (req, res) => {
  await hallService.deleteHallById(req.params.hallId);
  res.status(204).send();
});

module.exports = {
  createHall,
  getHalls,
  getHall,
  getHallSeats,
  updateHall,
  deleteHall,
};
