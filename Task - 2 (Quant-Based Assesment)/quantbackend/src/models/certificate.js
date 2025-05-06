const mongoose = require('mongoose');

const certSchema = new mongoose.Schema({
  userId:   { type: mongoose.ObjectId, ref: 'User' },
  courseId: { type: mongoose.ObjectId, ref: 'Course' },
  issuedAt: { type: Date, default: Date.now },
  score:    Number,
  pdfUrl:   String,
});

module.exports = mongoose.model('Certificate', certSchema);
