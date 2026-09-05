const SeatAssignment = require('../models/SeatAssignment');
const Exam = require('../models/Exam');
const Seat = require('../models/Seat');
const ExamHall = require('../models/ExamHall');
const Notification = require('../models/Notification');
const { shuffle } = require('../utils/shuffle');
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

const bulkCreateSeatAssignments = async (body) => {
  const { student_ids, exam_id, hall_id } = body;

  // Verify exam exists
  const exam = await Exam.findById(exam_id);
  if (!exam) throw ApiError.notFound('Exam not found');

  // Verify hall is assigned to this exam
  const examHall = await ExamHall.findOne({ exam_id, hall_id });
  if (!examHall) throw ApiError.badRequest('Selected hall is not assigned to this exam');

  // Find students already assigned to this exam
  const existingAssignments = await SeatAssignment.find({
    exam_id,
    student_id: { $in: student_ids },
  });
  const alreadyAssignedStudentIds = existingAssignments.map(a => a.student_id.toString());
  
  // Filter out already assigned students
  const newStudentIds = student_ids.filter(id => !alreadyAssignedStudentIds.includes(id));
  if (newStudentIds.length === 0) {
    throw ApiError.badRequest('All selected students are already assigned to this exam');
  }

  // Find seats in this hall NOT already assigned to this exam
  const assignedSeatIds = await SeatAssignment.find({ exam_id }).distinct('seat_id');
  const availableSeats = await Seat.find({
    hall_id,
    status: { $in: ['available', 'occupied'] },
    _id: { $nin: assignedSeatIds },
  })

  if (availableSeats.length < newStudentIds.length) {
    throw ApiError.badRequest(
      `Not enough available seats in this hall. Need ${newStudentIds.length}, have ${availableSeats.length}`
    );
  }
    const shuffledStudentIds = shuffle(newStudentIds);
    const shuffledSeats = shuffle(availableSeats);

  // Create assignments
  const assignments = shuffledStudentIds.map((studentId, i) => ({
    student_id: studentId,
    exam_id,
    seat_id: shuffledSeats[i]._id,
    attendance_status: 'pending',
    assigned_at: new Date(),
  }));

  const created = await SeatAssignment.insertMany(assignments);
  return { created, skipped: alreadyAssignedStudentIds.length, totalRequested: student_ids.length };
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
      populate: {
        path: 'hall_id',
        select: 'hall_name building_id',
        populate: { path: 'building_id', select: 'building_name' }
      }
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
  bulkCreateSeatAssignments,
  querySeatAssignments,
  getSeatAssignmentById,
  updateAttendance,
  deleteSeatAssignmentById,
};