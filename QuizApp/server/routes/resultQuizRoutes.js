const express = require('express');
const router = express.Router();
const {getResultcan,getResultQuizzesByCandidateAndAssignmentId, getResultsByRecruiterId, getAllResultQuizzes,getResultQuizById ,getResultQuizzesByAid,createResultQuiz,updateResultQuiz,deleteResultQuiz} = require('../controllers/resultQuizController');
router.post('/', createResultQuiz);
// Get all result quizzes
router.get('/', getAllResultQuizzes);

// Get a single result quiz by ID
router.get('/:id', getResultQuizById);

// Create a new result quiz


// Update a result quiz by ID
router.put('/:id',updateResultQuiz);

// Delete a result quiz by ID
router.delete('/:id',deleteResultQuiz);

router.get('/results/recruiter/:rhId', getResultsByRecruiterId);
router.get('/byAssignment/:Aid', getResultQuizzesByAid);
router.get('/:candidateId/:assignmentId', getResultQuizzesByCandidateAndAssignmentId);
router.get('/can/:candidateId/canresult',getResultcan);
module.exports = router;
