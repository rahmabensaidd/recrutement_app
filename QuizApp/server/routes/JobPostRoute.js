const express = require('express');
const router = express.Router();
const quizController = require('../controllers/JobPostController');
const {postulate,deletepost,allposts,getpostbyId,createpost,getmyposts,deleteAllposts} = require('../controllers/JobPostController');
// Create a new quiz
router.post('/createpost', createpost);
router.get('/all',allposts);
router.get('/myall/:rhId', getmyposts);
router.put('/:canId/postcan/:id',postulate);
router.delete('/delete-myall/:rhId', deleteAllposts);
router.get('/:id',getpostbyId);
router.delete('/:id', deletepost);

/*
// Delete all quizzes


// Get all quizzes


router.get('/:id',getQuizById);

// Delete a quiz by ID
router.delete('/:id', quizController.deleteQuiz);

// Update a quiz by ID

*/
module.exports = router;
