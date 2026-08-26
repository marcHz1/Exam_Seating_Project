const mongoose = require('mongoose');
const { ExamStatus } = require('../utils/enums');

const examSchema = new mongoose.Schema(
  {
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    exam_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamType', required: true },
    created_by_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    exam_date: { type: Date, required: true },
    start_time: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    end_time: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    status: {
      type: String,
      enum: Object.values(ExamStatus),
      default: ExamStatus.SCHEDULED,
    },
  },
  { timestamps: true }
);

examSchema.index({ subject_id: 1 });
examSchema.index({ exam_type_id: 1 });
examSchema.index({ exam_date: 1 });
examSchema.index({ status: 1 });

module.exports = mongoose.model('Exam', examSchema);