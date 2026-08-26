const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const semesterRoutes = require('./semesterRoutes');
const subjectRoutes = require('./subjectRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const examTypeRoutes = require('./examTypeRoutes');
const examRoutes = require('./examRoutes');
const adminRoutes = require('./adminRoutes');
const buildingRoutes = require('./buildingRoutes');
const hallRoutes = require('./hallRoutes');
const seatRoutes = require('./seatRoutes');
const examHallRoutes = require('./examHallRoutes');
const supervisorRoutes = require('./supervisorRoutes');
const supervisorAssignmentRoutes = require('./supervisorAssignmentRoutes');
const seatAssignmentRoutes = require('./seatAssignmentRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/semesters', semesterRoutes);
router.use('/subjects', subjectRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/exam-types', examTypeRoutes);
router.use('/exams', examRoutes);
router.use('/admins', adminRoutes);
router.use('/buildings', buildingRoutes);
router.use('/halls', hallRoutes);
router.use('/seats', seatRoutes);
router.use('/exam-halls', examHallRoutes);
router.use('/supervisors', supervisorRoutes);
router.use('/supervisor-assignments', supervisorAssignmentRoutes);
router.use('/seat-assignments', seatAssignmentRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
