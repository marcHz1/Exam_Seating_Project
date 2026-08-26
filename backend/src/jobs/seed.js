require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const logger = require('../config/logger');

// Models
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Supervisor = require('../models/Supervisor');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const ExamType = require('../models/ExamType');
const Building = require('../models/Building');
const Hall = require('../models/Hall');
const Enrollment = require('../models/Enrollment');
const Exam = require('../models/Exam');
const ExamHall = require('../models/ExamHall');
const SupervisorAssignment = require('../models/SupervisorAssignment');

const seed = async () => {
  try {
    await connectDB();
    logger.info('Connected to database. Seeding...');

    // Clear existing data
    await Promise.all([
      Student.deleteMany(),
      Admin.deleteMany(),
      Supervisor.deleteMany(),
      Semester.deleteMany(),
      Subject.deleteMany(),
      ExamType.deleteMany(),
      Building.deleteMany(),
      Hall.deleteMany(),
      Enrollment.deleteMany(),
      Exam.deleteMany(),
      ExamHall.deleteMany(),
      SupervisorAssignment.deleteMany(),
    ]);
    logger.info('Cleared existing data');

    // ─── TEST USERS ───
    const admin = await Admin.create({
      full_name: 'System Admin',
      email: 'admin@test.com',
      password_hash: 'admin123',
    });
    logger.info(`Admin created: ${admin.email} / password: admin123`);

    const student = await Student.create({
      full_name: 'John Doe',
      university_number: 'UNI2026001',
      email: 'student@test.com',
      password_hash: 'student123',
      current_level: 2,
      phone: '+1234567890',
    });
    logger.info(`Student created: ${student.email} / password: student123`);

    const supervisor = await Supervisor.create({
      full_name: 'Dr. Jane Smith',
      email: 'supervisor@test.com',
      password_hash: 'supervisor123',
      phone: '+1987654321',
    });
    logger.info(`Supervisor created: ${supervisor.email} / password: supervisor123`);

    // ─── REFERENCE DATA ───
    const semester = await Semester.create({
      name: 'Fall 2026',
      academic_year: '2026-2027',
      start_date: new Date('2026-09-01'),
      end_date: new Date('2026-12-20'),
    });

    const subject = await Subject.create({
      subject_code: 'CS101',
      subject_name: 'Introduction to Computer Science',
      credit_hours: 3,
      level_year: 2,
      semester_id: semester._id,
    });

    const subject2 = await Subject.create({
      subject_code: 'MATH201',
      subject_name: 'Calculus II',
      credit_hours: 4,
      level_year: 2,
      semester_id: semester._id,
    });

    const examType = await ExamType.create({ type_name: 'midterm' });
    await ExamType.create({ type_name: 'final' });
    await ExamType.create({ type_name: 'quiz' });

    const building = await Building.create({
      building_name: 'Science Block A',
      location: 'North Campus',
    });

    const hall = await Hall.create({
      building_id: building._id,
      hall_name: 'Lecture Hall 101',
      capacity: 40,
      rows_count: 5,
      columns_count: 8,
    });
    logger.info(`Hall created with ${hall.rows_count * hall.columns_count} seats`);

    // ─── ENROLLMENTS ───
    await Enrollment.create({
      student_id: student._id,
      subject_id: subject._id,
      is_retake: false,
      status: 'active',
    });
    await Enrollment.create({
      student_id: student._id,
      subject_id: subject2._id,
      is_retake: false,
      status: 'active',
    });

    // ─── EXAM ───
    const exam = await Exam.create({
      subject_id: subject._id,
      exam_type_id: examType._id,
      created_by_admin_id: admin._id,
      exam_date: new Date('2026-10-15'),
      start_time: '09:00',
      end_time: '11:00',
      status: 'scheduled',
    });

    await ExamHall.create({ exam_id: exam._id, hall_id: hall._id });

    await SupervisorAssignment.create({
      exam_hall_id: (await ExamHall.findOne({ exam_id: exam._id }))._id,
      supervisor_id: supervisor._id,
      role: 'head',
    });

    logger.info('\n✅ SEED COMPLETE');
    logger.info('═══════════════════════════════════════════════');
    logger.info('  LOGIN CREDENTIALS');
    logger.info('═══════════════════════════════════════════════');
    logger.info('  Admin:      admin@test.com     / admin123');
    logger.info('  Student:    student@test.com   / student123');
    logger.info('  Supervisor: supervisor@test.com / supervisor123');
    logger.info('═══════════════════════════════════════════════');

    process.exit(0);
  } catch (err) {
    logger.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();