const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

// unique: true on email already creates the index — do NOT duplicate
// adminSchema.index({ email: 1 }); // REMOVED

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('Admin', adminSchema);