const Hall = require('../models/Hall');
const Seat = require('../models/Seat');
const ExamHall = require('../models/ExamHall');
const ApiError = require('../utils/ApiError');

const createHall = async (body) => {
  const hall = await Hall.create(body);
  return hall;
};

const queryHalls = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'hall_name';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const halls = await Hall.find(filter)
    .populate('building_id', 'building_name location')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Hall.countDocuments(filter);
  return { halls, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getHallById = async (id) => {
  return Hall.findById(id).populate('building_id');
};

const getHallSeats = async (id) => {
  const hall = await getHallById(id);
  if (!hall) throw ApiError.notFound('Hall not found');
  const seats = await Seat.find({ hall_id: id }).sort({ row_number: 1, column_number: 1 });
  return { hall, seats };
};

const updateHallById = async (id, body) => {
  const hall = await getHallById(id);
  if (!hall) throw ApiError.notFound('Hall not found');
  Object.assign(hall, body);
  await hall.save();
  return hall;
};

const deleteHallById = async (id) => {
  const hall = await getHallById(id);
  if (!hall) throw ApiError.notFound('Hall not found');
  
  // BLOCK: Cannot delete if hall is assigned to exams
  const examHallCount = await ExamHall.countDocuments({ hall_id: id });
  if (examHallCount > 0) {
    throw ApiError.badRequest('Cannot delete hall assigned to exams. Remove from exams first.');
  }
  
  // CASCADE: Delete all auto-generated seats
  await Seat.deleteMany({ hall_id: id });
  await Hall.deleteOne({ _id: id });
  return hall;
};

module.exports = {
  createHall,
  queryHalls,
  getHallById,
  getHallSeats,
  updateHallById,
  deleteHallById,
};