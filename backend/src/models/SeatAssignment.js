const mongoose = require('mongoose');
const { AttendanceStatus } = require('../utils/enums');

const seatAssignmentSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    seat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat', required: true },
    attendance_status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PENDING,
    },
    check_in_time: { type: Date, default: null },
    assigned_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

seatAssignmentSchema.index({ student_id: 1, exam_id: 1 }, { unique: true });
seatAssignmentSchema.index({ exam_id: 1 });
seatAssignmentSchema.index({ seat_id: 1 });
seatAssignmentSchema.index({ attendance_status: 1 });

module.exports = mongoose.model('SeatAssignment', seatAssignmentSchema);