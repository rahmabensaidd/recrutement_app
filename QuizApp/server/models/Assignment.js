const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // Référence au modèle Quiz si vous en avez un
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle User si vous stockez les utilisateurs
    required: true
  },
  rhId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle User si vous stockez les utilisateurs
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  achievement: {
    type: Boolean, // Type de l'attribut achievement
    default: 'false', // Valeur par défaut si nécessaire
  },
  
  deadline: {
    type: Date, // Type for the deadline attribute
    required: true // Making it a required field
  },
  description:{
    type:String,
    required:false
  },
  time: {
      type: Number,
      required: true
    },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
