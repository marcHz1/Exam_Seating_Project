const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    subject_code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    subject_name: { type: String, required: true, trim: true, maxlength: 100 },
    credit_hours: { type: Number, required: true, min: 1, max: 10 },
    level_year: { type: Number, required: true, min: 1, max: 10 },
    is_mandatory: { type: Boolean, default: true },
    semester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  },
  { timestamps: true }
);

subjectSchema.index({ semester_id: 1 });
// unique: true on subject_code already creates the index — do NOT duplicate
// subjectSchema.index({ subject_code: 1 }); // REMOVED

module.exports = mongoose.model('Subject', subjectSchema);