const mongoose = require('mongoose');

const examHallSchema = new mongoose.Schema(
  {
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    hall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  },
  { timestamps: true }
);

examHallSchema.index({ exam_id: 1, hall_id: 1 }, { unique: true });
examHallSchema.index({ hall_id: 1 });

module.exports = mongoose.model('ExamHall', examHallSchema);