const mongoose = require('mongoose');
const { NotificationChannel, NotificationStatus } = require('../utils/enums');

const notificationSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    seat_assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SeatAssignment', required: true },
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      required: true,
    },
    message: { type: String, required: true, maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
    },
    sent_at: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ student_id: 1, status: 1 });
notificationSchema.index({ seat_assignment_id: 1 });

module.exports = mongoose.model('Notification', notificationSchema);