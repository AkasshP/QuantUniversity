const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  prompt:        String,
  options:      [String],
  correctAnswer: String,
});

const moduleSchema = new mongoose.Schema({
  courseId:     mongoose.ObjectId,
  index:        Number,
  title:        String,
  slideUrl:     String,
  videoUrl:     String,
  text:         String,
  quiz: {
    questions:   [quizQuestionSchema],
    passingScore:{ type: Number, default: 1 }
  },
});

module.exports = mongoose.model('Module', moduleSchema);
