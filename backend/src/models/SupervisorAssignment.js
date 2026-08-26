const mongoose = require('mongoose');
const { SupervisorRole } = require('../utils/enums');

const supervisorAssignmentSchema = new mongoose.Schema(
  {
    exam_hall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamHall', required: true },
    supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
    role: {
      type: String,
      enum: Object.values(SupervisorRole),
      default: SupervisorRole.INVIGILATOR,
    },
  },
  { timestamps: true }
);

supervisorAssignmentSchema.index({ exam_hall_id: 1, supervisor_id: 1 }, { unique: true });
supervisorAssignmentSchema.index({ supervisor_id: 1 });

module.exports = mongoose.model('SupervisorAssignment', supervisorAssignmentSchema);