const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
  {
    building_name: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Building', buildingSchema);