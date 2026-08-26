const mongoose = require('mongoose');
const Seat = require('./Seat');

const hallSchema = new mongoose.Schema(
  {
    building_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    hall_name: { type: String, required: true, trim: true, maxlength: 100 },
    capacity: { type: Number, required: true, min: 1 },
    rows_count: { type: Number, required: true, min: 1 },
    columns_count: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

hallSchema.index({ building_id: 1 });

hallSchema.post('save', async function (doc) {
  const totalSeats = doc.rows_count * doc.columns_count;
  const seats = [];
  for (let r = 1; r <= doc.rows_count; r++) {
    for (let c = 1; c <= doc.columns_count; c++) {
      seats.push({
        hall_id: doc._id,
        row_number: r,
        column_number: c,
        seat_label: `R${r}-C${c}`,
        status: 'available',
      });
    }
  }
  if (doc.capacity < totalSeats) {
    let excess = totalSeats - doc.capacity;
    for (let i = seats.length - 1; i >= 0 && excess > 0; i--) {
      seats[i].status = 'maintenance';
      excess--;
    }
  }
  await Seat.insertMany(seats);
});

module.exports = mongoose.model('Hall', hallSchema);