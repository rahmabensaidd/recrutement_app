const express = require('express');
const router = express.Router();
const {deleteAssig,getAssignmentById,  getAssignmentsByRecruiterId, assignQuiz, fetchAssignments, updateAssignment } = require('../controllers/assignmentController');

// Route pour assigner un quiz à un candidat
router.post('/assign', assignQuiz);

// Route pour récupérer les affectations d'un utilisateur par son ID
router.get('/userassign/:id', fetchAssignments); // Corrected function name to fetchAssignments
router.put('/update/:id', updateAssignment);
router.get('/allassignments/:rhId',  getAssignmentsByRecruiterId);
router.delete('/deleteAssignment/:id', deleteAssig); 
router.get('/assignment/:id', getAssignmentById);

module.exports = router;
