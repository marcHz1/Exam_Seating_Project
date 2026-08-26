/**
 * Centralized enum definitions matching confirmed business rules
 */

const EnrollmentStatus = {
  ACTIVE: 'active',
  DROPPED: 'dropped',
  COMPLETED: 'completed',
};

const ExamStatus = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const SeatStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
};

const ExamTypeName = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  PRACTICAL: 'practical',
};

const SupervisorRole = {
  HEAD: 'head',
  ASSISTANT: 'assistant',
  INVIGILATOR: 'invigilator',
};

const AttendanceStatus = {
  PENDING: 'pending',
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
};

const NotificationChannel = {
  EMAIL: 'email',
  SMS: 'sms',
  IN_APP: 'in_app',
};

const NotificationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  READ: 'read',
};

module.exports = {
  EnrollmentStatus,
  ExamStatus,
  SeatStatus,
  ExamTypeName,
  SupervisorRole,
  AttendanceStatus,
  NotificationChannel,
  NotificationStatus,
};
