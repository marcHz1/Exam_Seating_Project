const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema(
  {
    requester_type: {
      type: String,
      enum: ['student', 'supervisor'],
      required: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, default: '', trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    admin_response: { type: String, default: '', trim: true, maxlength: 1000 },
    resolved_at: { type: Date, default: null },
  },
  { timestamps: true }
);

passwordResetRequestSchema.index({ email: 1, requester_type: 1, status: 1 });
passwordResetRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
