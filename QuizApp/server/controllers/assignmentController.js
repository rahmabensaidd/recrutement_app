const Assignment = require('../models/Assignment');

exports.assignQuiz = async (req, res) => {
  try {
    console.log('Received body:', req.body); // Log the request body

    const { Qid, canId, rhId, achievement, description, deadline, time } = req.body;

    if (!Qid || !canId || !rhId || !deadline || !time) {
      return res.status(400).json({ error: 'Qid, canId, rhId, deadline, and time are required.' });
    }

    const newAssignment = new Assignment({
      quizId: Qid,
      candidateId: canId,
      rhId,
      sentAt: new Date(),
      achievement,
      deadline,
      description,
      time,
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error('Error:', error); // Log the error
    res.status(500).json({ error: error.message });
  }
};
exports.fetchAssignments = async (req, res) => {
  const { id } = req.params;

  try {
    const assignments = await Assignment.find({ candidateId: id })
      .populate('quizId', 'title') // Populate quizId field with 'title' from Quiz model
      .populate('rhId', 'name email'); // Populate rhId field with 'name' and 'email' from User model
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// update assignement 
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { quizId, candidateId, rhId, achievement, description, deadline, time } = req.body;

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { quizId, candidateId, rhId, achievement, description, deadline, time },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.fetchAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('quizId', 'title') // Populate quizId field with 'title' from Quiz model
      .populate('candidateId', 'name email') // Populate candidateId field with 'name' and 'email' from User model
      .populate('rhId', 'name email'); // Populate rhId field with 'name' and 'email' from User model
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteAssig = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findById(id)
      .populate('quizId', 'title') // Populate quizId field with 'title' from Quiz model
      .populate('candidateId', 'name email') // Populate candidateId field with 'name' and 'email' from User model
      .populate('rhId', 'name email'); // Populate rhId field with 'name' and 'email' from User model

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error fetching assignment by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getAssignmentsByRecruiterId = async (req, res) => {
  const { rhId } = req.params; // Recruiter ID

  // Populate rhId field with 'name' and 'email' from User model

  try {
    const assignments = await Assignment.find({ rhId }).populate('quizId', 'title') // Populate quizId field with 'title' from Quiz model
    .populate('candidateId', 'name email') // Populate candidateId field with 'name' and 'email' from User model
    .populate('rhId', 'name email'); 

    if (assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this recruiter.' });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
