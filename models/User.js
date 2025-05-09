const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  permissions: {
    createBooks: { type: Boolean, default: false },
    updateBooks: { type: Boolean, default: false },
    deleteBooks: { type: Boolean, default: false },
    updateUsers: { type: Boolean, default: false },
    deleteUsers: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
