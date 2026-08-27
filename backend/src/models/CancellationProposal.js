const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    supervisor_assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SupervisorAssignment', required: true },
    supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
    exam_hall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamHall', required: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    replacement_supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', default: null },
    admin_response: { type: String, default: '', trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

proposalSchema.index({ supervisor_id: 1, status: 1 });
proposalSchema.index({ exam_hall_id: 1 });
proposalSchema.index({ status: 1 });

module.exports = mongoose.model('CancellationProposal', proposalSchema);