const mongoose = require('mongoose');

const moduleProgressSchema = new mongoose.Schema({
  courseId:   { type: mongoose.ObjectId, ref: 'Course', required: true },
  moduleId:   { type: mongoose.ObjectId, ref: 'Module', required: true },
  unlocked:   { type: Boolean, default: false },
  completed:  { type: Boolean, default: false },
  quizScore:  { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  email:           { type: String, required: true, unique: true },
  passwordHash:    { type: String, required: true },
  role:            { type: String, enum: ['free','subscriber','premium'], default: 'free' },
  enrolledCourses: [{ type: mongoose.ObjectId, ref: 'Course' }],
  moduleProgress:  [moduleProgressSchema],
  totalScore: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
