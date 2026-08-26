const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    academic_year: { type: String, required: true, trim: true, maxlength: 20 },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  { timestamps: true }
);

semesterSchema.index({ academic_year: 1, name: 1 });

module.exports = mongoose.model('Semester', semesterSchema);