const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const {getQuizById,getSharedQuizzes,getAllQuizzes,createQuiz,deleteAllQuizzes,shareQuiz,unshareQuiz} = require('../controllers/quizController');
// Create a new quiz
router.post('/create', createQuiz);

// Delete all quizzes
router.delete('/delete-all', deleteAllQuizzes);

// Get all quizzes

router.get('/shared', getSharedQuizzes);
router.get('/all/:rhId', getAllQuizzes);
// Get a quiz by ID
router.get('/:id',getQuizById);

// Delete a quiz by ID
router.delete('/:id', quizController.deleteQuiz);

// Update a quiz by ID
router.put('/:id', quizController.updateQuiz);


router.put('/sharequiz/:id', quizController.shareQuiz);

router.put('/unsharequiz/:id', quizController.unshareQuiz);

module.exports = router;
