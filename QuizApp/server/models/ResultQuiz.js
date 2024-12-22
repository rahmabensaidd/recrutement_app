const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultQuizSchema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  score: { type: Number, required: true },
  questionsAttempted: { type: Number, required: true },
  wrongAnswers: [{
    question: { type: String, required: true }, // Storing question text as String
    selectedOption: { type: String, required: true }
  }],
  timestamp: { type: Date, default: Date.now, required: false }
});

module.exports = mongoose.model('ResultQuiz', resultQuizSchema);
