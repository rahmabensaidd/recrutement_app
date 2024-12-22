const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    text: { type: String, required: true },
    options: [{ text: String, isCorrect: Boolean }]
  }],
  shared: { type: Boolean, default: false },
  category: { type: String },
  rhId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Référence au modèle User
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
