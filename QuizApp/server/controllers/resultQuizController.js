const mongoose = require('mongoose');
const ResultQuiz = require('../models/ResultQuiz');
const Candidate = require('../models/User'); // Ajustez en fonction de votre structure de fichiers réelle
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment'); // Ajout pour référence à l'assignation

// Get all result quizzes
exports.getAllResultQuizzes = async (req, res) => {
  try {
    const resultQuizzes = await ResultQuiz.find()
      .populate('candidateId')
      .populate('quizId')
      .populate('assignmentId'); // Populate Assigid with Assignment details

    res.status(200).json(resultQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single result quiz by ID
exports.getResultQuizById = async (req, res) => {
  try {
    const resultQuiz = await ResultQuiz.findById(req.params.id)
      .populate('candidateId')
      .populate('quizId')
      .populate('assignmentId'); // Populate Assigid with Assignment details

    if (!resultQuiz) {
      return res.status(404).json({ message: 'ResultQuiz not found' });
    }

    res.status(200).json(resultQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a result quiz
exports.createResultQuiz = async (req, res) => {
  try {
    // Extract data from request body
    const { candidateId, quizId, assignmentId, score, questionsAttempted, wrongAnswers } = req.body;

    // Validate that all required fields are present
    if (!candidateId || !quizId || !assignmentId || score === undefined || questionsAttempted === undefined || !Array.isArray(wrongAnswers)) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate that wrongAnswers contains selectedOption for each item
    for (let i = 0; i < wrongAnswers.length; i++) {
      if (!wrongAnswers[i].selectedOption) {
        return res.status(400).json({ message: `Selected option is required for wrong answer at index ${i}` });
      }
    }

    // Create new quiz result object
    const resultQuiz = await ResultQuiz.create({
      candidateId,
      quizId,
      assignmentId,
      score,
      questionsAttempted,
      wrongAnswers,
    });

    res.status(201).json(resultQuiz); // Respond with created resultQuiz object
  } catch (error) {
    console.error('Error creating quiz result:', error);
    res.status(500).json({ message: 'Failed to create quiz result' });
  }
};
// Update a result quiz by ID
exports.updateResultQuiz = async (req, res) => {
  try {
    const updatedResultQuiz = await ResultQuiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedResultQuiz) {
      return res.status(404).json({ message: 'ResultQuiz not found' });
    }

    res.status(200).json(updatedResultQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a result quiz by ID
exports.deleteResultQuiz = async (req, res) => {
  try {
    const deletedResultQuiz = await ResultQuiz.findByIdAndDelete(req.params.id);

    if (!deletedResultQuiz) {
      return res.status(404).json({ message: 'ResultQuiz not found' });
    }

    res.status(200).json({ message: 'ResultQuiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get result quizzes by assignment ID (Assigid)
exports.getResultQuizzesByAid = async (req, res) => {
  const { Aid } = req.params;

  try {
    // Trim and clean Assignment ID
    const cleanAid = Aid.trim();

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(cleanAid)) {
      return res.status(400).json({ message: 'Invalid assignment ID' });
    }

    console.log('Cleaned Assignment ID:', cleanAid); // Log for verification

    // Query ResultQuiz collection by Assigid
    const resultQuizzes = await ResultQuiz.find({ Assigid: cleanAid })
      .populate('candidateId')
      .populate('quizId')
      .populate('Assigid'); // Populate Assigid with Assignment details

    if (!resultQuizzes.length) {
      return res.status(404).json({ message: 'No result quizzes found for this assignment ID' });
    }

    res.status(200).json(resultQuizzes);
  } catch (error) {
    console.error('Error fetching result quizzes by Aid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getResultQuizzesByCandidateAndAssignmentId = async (req, res) => {
  const { candidateId, assignmentId } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(candidateId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: 'Invalid candidateId or assignmentId' });
    }

    const resultQuizzes = await ResultQuiz.find({ candidateId, assignmentId })
      .populate('candidateId')
      .populate('quizId')
      .populate('assignmentId');

    if (!resultQuizzes || resultQuizzes.length === 0) {
      return res.status(404).json({ message: `No result quizzes found for candidateId ${candidateId} and assignmentId ${assignmentId}` });
    }

    res.status(200).json(resultQuizzes);
  } catch (error) {
    console.error('Error fetching result quizzes by candidateId and assignmentId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getResultcan = async (req, res) => {
  const { candidateId } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ message: 'Invalid candidateId' });
    }

    const resultQuizzes = await ResultQuiz.find({ candidateId })
      .populate('candidateId')
      .populate('quizId')
      .populate('assignmentId');

    if (!resultQuizzes || resultQuizzes.length === 0) {
      return res.status(404).json({ message: `No result quizzes found for candidateId ${candidateId}` });
    }

    res.status(200).json(resultQuizzes);
  } catch (error) {
    console.error('Error fetching result quizzes by candidateId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getResultsByRecruiterId = async (req, res) => {
  const { rhId } = req.params; // Recruiter ID

  try {
    // Find all assignments associated with the recruiter
    const assignments = await Assignment.find({ rhId });

    if (assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this recruiter.' });
    }

    // Extract all assignment IDs
    const assignmentIds = assignments.map(assignment => assignment._id);

    // Find all results for these assignment IDs
    const results = await ResultQuiz.find({ assignmentId: { $in: assignmentIds } })
      .populate('candidateId', 'name email') // Optional: populate candidate details
      .populate('quizId', 'title') // Optional: populate quiz details
      .populate('assignmentId'); // Optional: populate assignment details

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};