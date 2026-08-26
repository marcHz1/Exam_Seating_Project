const mongoose = require('mongoose');
const { ExamTypeName } = require('../utils/enums');

const examTypeSchema = new mongoose.Schema(
  {
    type_name: {
      type: String,
      enum: Object.values(ExamTypeName),
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamType', examTypeSchema);