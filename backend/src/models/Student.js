const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 100 },
    university_number: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true, minlength: 6, select: false },
    current_level: { type: Number, required: true, min: 1, max: 5 },
    phone: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

// unique: true above already creates these indexes — do NOT duplicate them
// studentSchema.index({ email: 1 });          // REMOVED — unique: true handles it
// studentSchema.index({ university_number: 1 }); // REMOVED — unique: true handles it

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('Student', studentSchema);