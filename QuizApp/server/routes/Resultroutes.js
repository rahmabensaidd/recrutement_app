const express = require('express');
const router = express.Router();
const {createResult,getResultById,getAllResults} = require('../controllers/resultcontroller');

// Get all result quizzes
router.get('/', getAllResults);

// Get a single result quiz by ID
router.get('/:id', getResultById);

// Create a new result quiz
router.post('/', createResult);

module.exports = router;
