const mongoose = require('mongoose');
const { EnrollmentStatus } = require('../utils/enums');

const enrollmentSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    is_retake: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      default: EnrollmentStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student_id: 1, subject_id: 1 }, { unique: true });
enrollmentSchema.index({ subject_id: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);