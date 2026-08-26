const mongoose = require('mongoose');
const { SeatStatus } = require('../utils/enums');

const seatSchema = new mongoose.Schema(
  {
    hall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
    row_number: { type: Number, required: true, min: 1 },
    column_number: { type: Number, required: true, min: 1 },
    seat_label: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(SeatStatus),
      default: SeatStatus.AVAILABLE,
    },
  },
  { timestamps: true }
);

seatSchema.index({ hall_id: 1 });
seatSchema.index({ hall_id: 1, row_number: 1, column_number: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);