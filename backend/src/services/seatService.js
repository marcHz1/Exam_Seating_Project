const Seat = require('../models/Seat');
const ApiError = require('../utils/ApiError');

const querySeats = async (filter, options) => {
  const { sortBy, limit = 50, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'row_number column_number';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const seats = await Seat.find(filter)
    .populate('hall_id', 'hall_name building_id')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Seat.countDocuments(filter);
  return { seats, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getSeatById = async (id) => {
  return Seat.findById(id).populate('hall_id');
};

const updateSeatById = async (id, body) => {
  const seat = await getSeatById(id);
  if (!seat) throw ApiError.notFound('Seat not found');
  Object.assign(seat, body);
  await seat.save();
  return seat;
};

module.exports = {
  querySeats,
  getSeatById,
  updateSeatById,
};
