const mongoose = require('mongoose');
const Result = require('../models/Result');
const Candidate = require('../models/User'); // Adjust according to your actual file structure
const Quiz = require('../models/Quiz');

// Get all result quizzes
exports.getAllResults = async (req, res) => {
  try {
    const resultQuizzes = await Result.find()
      .populate('candidateId')
      .populate('quizId');

    res.status(200).json(resultQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single result quiz by ID
exports.getResultById = async (req, res) => {
  try {
    const resultQuiz = await Result.findById(req.params.id)
      .populate('candidateId')
      .populate('quizId');

    if (!resultQuiz) {
      return res.status(404).json({ message: 'ResultQuiz not found' });
    }

    res.status(200).json(resultQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a result quiz
exports.createResult = async (req, res) => {
  try {
      const { candidateId, quizId, score, questionsAttempted, wrongAnswers } = req.body;

      console.log('Received Data:', { candidateId, quizId, score, questionsAttempted, wrongAnswers });

      if (!candidateId || !quizId || score === undefined || questionsAttempted === undefined || !Array.isArray(wrongAnswers)) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      for (let i = 0; i < wrongAnswers.length; i++) {
          if (!wrongAnswers[i].selectedOption) {
              return res.status(400).json({ message: `Selected option is required for wrong answer at index ${i}` });
          }
      }

      const resultQuiz = await Result.create({
          candidateId,
          quizId,
          score,
          questionsAttempted,
          wrongAnswers,
      });

      res.status(201).json(resultQuiz);
  } catch (error) {
      console.error('Error creating quiz result:', error);
      res.status(500).json({ message: 'Failed to create quiz result' });
  }
};
