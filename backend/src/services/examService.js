const Exam = require('../models/Exam');
const ExamHall = require('../models/ExamHall');
const Hall = require('../models/Hall');
const Seat = require('../models/Seat');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Enrollment = require('../models/Enrollment');
const SeatAssignment = require('../models/SeatAssignment');
const SupervisorAssignment = require('../models/SupervisorAssignment');
const Notification = require('../models/Notification');
const notificationService = require('./notificationService');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { shuffle } = require('../utils/shuffle');

const createExam = async (body, adminId) => {
  const { hall_ids, supervisor_ids, head_supervisors, ...examBody } = body;
  
  // 1. Create the exam
  const exam = await Exam.create({ ...examBody, created_by_admin_id: adminId });
  console.log('✅ Exam created:', exam._id, 'Subject:', exam.subject_id);
  
  // 2. If halls provided, auto-assign everything
  if (hall_ids && hall_ids.length > 0) {
    const uniqueHallIds = [...new Set(hall_ids)];
    
    // Create ExamHall records
    const examHallDocs = uniqueHallIds.map(hallId => ({
      exam_id: exam._id,
      hall_id: hallId,
    }));
    await ExamHall.insertMany(examHallDocs);
    console.log('🏛️ Halls assigned:', uniqueHallIds.length);
    
    // Get subject to check level_year
    const subject = await Subject.findById(exam.subject_id);
    if (!subject) throw ApiError.notFound('Subject not found');
    console.log('📚 Subject:', subject.subject_name, 'level_year:', subject.level_year);
    
    let targetStudents;
    if (subject.is_mandatory) {
      targetStudents = await Student.find({});
      console.log('👥 Mandatory subject: all students assigned:', targetStudents.length);
    } else {
      const enrollments = await Enrollment.find({ subject_id: exam.subject_id, status: 'active' }).populate('student_id');
      targetStudents = enrollments.filter(enrollment => enrollment.student_id).map(enrollment => enrollment.student_id);
      console.log('📋 Optional subject: enrolled students assigned:', targetStudents.length);
    }
    
    // Assign seats if we found students
    if (targetStudents.length > 0) {
      const availableSeats = await Seat.find({
        hall_id: { $in: uniqueHallIds },
        status: { $in: ['available', 'occupied'] },
      })
      
      console.log('💺 Available seats:', availableSeats.length, 'Students:', targetStudents.length);
      
      if (availableSeats.length < targetStudents.length) {
        throw ApiError.badRequest(
          `Not enough seats. Need ${targetStudents.length}, have ${availableSeats.length}`
        );
      }
        const shuffledStudents = shuffle(targetStudents);
        const shuffledSeats = shuffle(availableSeats);
      
      const assignments = shuffledStudents.map((student, i) => ({
        student_id: student._id,
        exam_id: exam._id,
        seat_id: shuffledSeats[i]._id,
        attendance_status: 'pending',
        assigned_at: new Date(),
      }));
      
      const createdAssignments = await SeatAssignment.insertMany(assignments);
      for (const assignment of createdAssignments) {
        try {
          await notificationService.notifySeatAssignment(assignment._id);
        } catch (err) {
          logger.error(`Failed to create notification for seat assignment ${assignment._id}`, err);
        }
      }
      console.log('✅ Auto-assigned', assignments.length, 'seats');
      logger.info(`Auto-assigned ${assignments.length} seats for exam ${exam._id}`);
    } else {
      console.log('❌ No students found at all for level', subject.level_year);
    }
  }
  
  // 3. If supervisors provided, auto-assign them
  if (supervisor_ids && supervisor_ids.length > 0 && head_supervisors && head_supervisors.length > 0) {
    const examHalls = await ExamHall.find({ exam_id: exam._id });
    if (examHalls.length === 0) {
      throw ApiError.badRequest('No halls assigned to this exam');
    }
    
    const hallToExamHall = {};
    for (const eh of examHalls) {
      hallToExamHall[eh.hall_id.toString()] = eh._id.toString();
    }
    
    for (const { hall_id } of head_supervisors) {
      if (!hallToExamHall[hall_id]) {
        throw ApiError.badRequest('Hall is not assigned to this exam');
      }
    }
    
    const examHallIds = examHalls.map(eh => eh._id);
    const existingAssignments = await SupervisorAssignment.find({
      exam_hall_id: { $in: examHallIds },
    });
    
    const assignedSupervisorIds = existingAssignments.map(a => a.supervisor_id.toString());
    const unassignedSupervisorIds = supervisor_ids.filter(id => !assignedSupervisorIds.includes(id));
    
    if (unassignedSupervisorIds.length === 0) {
      throw ApiError.badRequest('All selected supervisors are already assigned to this exam');
    }
    
    const headSupervisorIds = head_supervisors.map(h => h.supervisor_id);
    for (const headId of headSupervisorIds) {
      if (!unassignedSupervisorIds.includes(headId)) {
        throw ApiError.badRequest('Head supervisor is already assigned or not in the selected pool');
      }
    }
    
    const assignments = [];
    for (const { hall_id, supervisor_id } of head_supervisors) {
      assignments.push({
        exam_hall_id: hallToExamHall[hall_id],
        supervisor_id: supervisor_id,
        role: 'head',
      });
    }
    
    const remainingIds = unassignedSupervisorIds.filter(id => !headSupervisorIds.includes(id));
    const shuffledHalls = [...examHalls].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < remainingIds.length; i++) {
      const supervisorId = remainingIds[i];
      const hall = shuffledHalls[i % shuffledHalls.length];
      assignments.push({
        exam_hall_id: hall._id,
        supervisor_id: supervisorId,
        role: 'invigilator',
      });
    }
    
    await SupervisorAssignment.insertMany(assignments);
    logger.info(`Auto-assigned ${assignments.length} supervisors for exam ${exam._id}`);
  }
  
  return exam;
};

const queryExams = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'exam_date';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const exams = await Exam.find(filter)
    .populate('subject_id', 'subject_code subject_name')
    .populate('exam_type_id', 'type_name')
    .populate('created_by_admin_id', 'full_name email')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Exam.countDocuments(filter);
  return { exams, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getExamById = async (id) => {
  return Exam.findById(id)
    .populate('subject_id')
    .populate('exam_type_id')
    .populate('created_by_admin_id', 'full_name email');
};

const updateExamById = async (id, body) => {
  const exam = await getExamById(id);
  if (!exam) throw ApiError.notFound('Exam not found');
  Object.assign(exam, body);
  await exam.save();
  return exam;
};

const deleteExamById = async (id) => {
  const exam = await getExamById(id);
  if (!exam) throw ApiError.notFound('Exam not found');
  
  // Get all related IDs before deleting anything
  const examHalls = await ExamHall.find({ exam_id: id });
  const examHallIds = examHalls.map(eh => eh._id);
  const seatAssignments = await SeatAssignment.find({ exam_id: id });
  const seatAssignmentIds = seatAssignments.map(sa => sa._id);
  
  // CASCADE: Delete all related records
  await Notification.deleteMany({ seat_assignment_id: { $in: seatAssignmentIds } });
  await SeatAssignment.deleteMany({ exam_id: id });
  await SupervisorAssignment.deleteMany({ exam_hall_id: { $in: examHallIds } });
  await ExamHall.deleteMany({ exam_id: id });
  await Exam.deleteOne({ _id: id });
  
  return exam;
};

const assignHallsToExam = async (examId, hallIds) => {
  const exam = await getExamById(examId);
  if (!exam) throw ApiError.notFound('Exam not found');

  const existing = await ExamHall.find({ exam_id: examId });
  const existingHallIds = existing.map(e => e.hall_id.toString());

  const newAssignments = [];
  for (const hallId of hallIds) {
    if (!existingHallIds.includes(hallId)) {
      newAssignments.push({ exam_id: examId, hall_id: hallId });
    }
  }

  if (newAssignments.length > 0) {
    await ExamHall.insertMany(newAssignments);
  }

  return ExamHall.find({ exam_id: examId }).populate('hall_id');
};

const autoAssignSeats = async (examId, hallIds = null) => {
  const exam = await getExamById(examId);
  if (!exam) throw ApiError.notFound('Exam not found');

  const existingAssignments = await SeatAssignment.find({ exam_id: examId }).distinct('student_id');
  const enrollments = await Enrollment.find({
    subject_id: exam.subject_id._id,
    status: 'active',
    student_id: { $nin: existingAssignments },
  }).populate('student_id');

  if (enrollments.length === 0) {
    throw ApiError.badRequest('No unassigned active enrollments found for this exam');
  }

  let targetHallIds = hallIds;
  if (!targetHallIds || targetHallIds.length === 0) {
    const examHalls = await ExamHall.find({ exam_id: examId });
    targetHallIds = examHalls.map(eh => eh.hall_id.toString());
  }

  if (targetHallIds.length === 0) {
    throw ApiError.badRequest('No halls assigned to this exam');
  }

  for (const hallId of targetHallIds) {
    const exists = await ExamHall.findOne({ exam_id: examId, hall_id: hallId });
    if (!exists) {
      await ExamHall.create({ exam_id: examId, hall_id: hallId });
    }
  }

  const availableSeats = await Seat.find({
    hall_id: { $in: targetHallIds },
    status: { $in: ['available', 'occupied'] },
  })

  if (availableSeats.length < enrollments.length) {
    throw ApiError.badRequest(`Not enough seats. Need ${enrollments.length}, have ${availableSeats.length}`);
  }
  shuffle(enrollments);
  shuffle(availableSeats);

  const assignments = [];
  for (let i = 0; i < enrollments.length; i++) {
    assignments.push({
      student_id: enrollments[i].student_id._id,
      exam_id: examId,
      seat_id: availableSeats[i]._id,
      attendance_status: 'pending',
      assigned_at: new Date(),
    });
  }

  const created = await SeatAssignment.insertMany(assignments);
  for (const assignment of created) {
    try {
      await notificationService.notifySeatAssignment(assignment._id);
    } catch (err) {
      logger.error(`Failed to create notification for seat assignment ${assignment._id}`, err);
    }
  }
  logger.info(`Auto-assigned ${created.length} seats for exam ${examId}`);
  return created;
};

const autoAssignSupervisors = async (examId, supervisorIds, headSupervisors) => {
  const exam = await getExamById(examId);
  if (!exam) throw ApiError.notFound('Exam not found');

  const examHalls = await ExamHall.find({ exam_id: examId });
  if (examHalls.length === 0) {
    throw ApiError.badRequest('No halls assigned to this exam');
  }

  const hallToExamHall = {};
  for (const eh of examHalls) {
    hallToExamHall[eh.hall_id.toString()] = eh._id.toString();
  }

  for (const { hall_id } of headSupervisors) {
    if (!hallToExamHall[hall_id]) {
      throw ApiError.badRequest('Hall is not assigned to this exam');
    }
  }

  const examHallIds = examHalls.map(eh => eh._id);
  const existingAssignments = await SupervisorAssignment.find({
    exam_hall_id: { $in: examHallIds },
  });

  const assignedSupervisorIds = existingAssignments.map(a => a.supervisor_id.toString());
  const unassignedSupervisorIds = supervisorIds.filter(id => !assignedSupervisorIds.includes(id));

  if (unassignedSupervisorIds.length === 0) {
    throw ApiError.badRequest('All selected supervisors are already assigned to this exam');
  }

  const headSupervisorIds = headSupervisors.map(h => h.supervisor_id);
  for (const headId of headSupervisorIds) {
    if (!unassignedSupervisorIds.includes(headId)) {
      throw ApiError.badRequest('Head supervisor is already assigned or not in the selected pool');
    }
  }

  const assignments = [];
  
  for (const { hall_id, supervisor_id } of headSupervisors) {
    assignments.push({
      exam_hall_id: hallToExamHall[hall_id],
      supervisor_id: supervisor_id,
      role: 'head',
    });
  }

  const remainingIds = unassignedSupervisorIds.filter(id => !headSupervisorIds.includes(id));
  const shuffledHalls = [...examHalls].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < remainingIds.length; i++) {
    const supervisorId = remainingIds[i];
    const hall = shuffledHalls[i % shuffledHalls.length];
    assignments.push({
      exam_hall_id: hall._id,
      supervisor_id: supervisorId,
      role: 'invigilator',
    });
  }

  const created = await SupervisorAssignment.insertMany(assignments);
  logger.info(`Auto-assigned ${created.length} supervisors for exam ${examId}`);
  return created;
};

const getExamDetails = async (id) => {
  const exam = await Exam.findById(id)
    .populate('subject_id')
    .populate('exam_type_id')
    .populate('created_by_admin_id', 'full_name email');

  if (!exam) throw ApiError.notFound('Exam not found');

  const examHalls = await ExamHall.find({ exam_id: id })
    .populate('hall_id', 'hall_name building_id capacity rows_count columns_count');

  const seatAssignments = await SeatAssignment.find({ exam_id: id })
    .populate('student_id', 'full_name university_number email')
    .populate({
      path: 'seat_id',
      select: 'seat_label row_number column_number hall_id',
      populate: { path: 'hall_id', select: 'hall_name' }
    });

  const supervisorAssignments = await SupervisorAssignment.find({
    exam_hall_id: { $in: examHalls.map(eh => eh._id) }
  }).populate('supervisor_id', 'full_name email phone')
    .populate({
      path: 'exam_hall_id',
      populate: { path: 'hall_id', select: 'hall_name' }
    });

  return {
    exam,
    halls: examHalls,
    seatAssignments,
    supervisorAssignments,
  };
};

module.exports = {
  createExam,
  queryExams,
  getExamById,
  updateExamById,
  deleteExamById,
  assignHallsToExam,
  autoAssignSeats,
  autoAssignSupervisors,
  getExamDetails
};