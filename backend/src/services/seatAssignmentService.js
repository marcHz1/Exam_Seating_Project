const SeatAssignment = require('../models/SeatAssignment');
const Exam = require('../models/Exam');
const Seat = require('../models/Seat');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

const createSeatAssignment = async (body) => {
  const examHalls = await require('../models/ExamHall').find({ exam_id: body.exam_id });
  const hallIds = examHalls.map(eh => eh.hall_id.toString());
  const seat = await Seat.findById(body.seat_id);
  if (!seat) throw ApiError.notFound('Seat not found');
  if (!hallIds.includes(seat.hall_id.toString())) {
    throw ApiError.badRequest('Seat does not belong to a hall assigned to this exam');
  }

  const existing = await SeatAssignment.findOne({
    student_id: body.student_id,
    exam_id: body.exam_id,
  });
  if (existing) {
    Object.assign(existing, body);
    await existing.save();
    return existing;
  }

  return SeatAssignment.create(body);
};

const querySeatAssignments = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'assigned_at';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const assignments = await SeatAssignment.find(filter)
    .populate('student_id', 'full_name university_number email')
    .populate({
      path: 'exam_id',
      select: 'exam_date start_time end_time subject_id',
      populate: { path: 'subject_id', select: 'subject_name subject_code' }
    })
    .populate({
      path: 'seat_id',
      select: 'seat_label row_number column_number hall_id',
      populate: { path: 'hall_id', select: 'hall_name' }
    })
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await SeatAssignment.countDocuments(filter);
  return { assignments, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getSeatAssignmentById = async (id) => {
  return SeatAssignment.findById(id)
    .populate('student_id', 'full_name university_number email')
    .populate('exam_id')
    .populate('seat_id');
};

const updateAttendance = async (id, body) => {
  const assignment = await getSeatAssignmentById(id);
  if (!assignment) throw ApiError.notFound('Seat assignment not found');
  Object.assign(assignment, body);
  if (body.attendance_status === 'present' && !body.check_in_time) {
    assignment.check_in_time = new Date();
  }
  await assignment.save();
  return assignment;
};

const deleteSeatAssignmentById = async (id) => {
  const assignment = await getSeatAssignmentById(id);
  if (!assignment) throw ApiError.notFound('Seat assignment not found');
  
  // CASCADE: Delete related notifications
  await Notification.deleteMany({ seat_assignment_id: id });
  await SeatAssignment.deleteOne({ _id: id });
  return assignment;
};

module.exports = {
  createSeatAssignment,
  querySeatAssignments,
  getSeatAssignmentById,
  updateAttendance,
  deleteSeatAssignmentById,
};