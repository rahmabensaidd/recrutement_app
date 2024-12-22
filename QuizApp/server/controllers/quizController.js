const Quiz = require('../models/Quiz');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const { rhId } = req.params;
    const quizzes = await Quiz.find({ rhId }); // Filtrer les quiz par rhId
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};
exports.updateQuiz = async (req, res) => {
  try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedQuiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(updatedQuiz);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id; // Assuming 'id' is the parameter name in your route

    console.log('Quiz ID:', quizId); // Log the quizId to check its value

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
};
// Delete all quizzes
exports.deleteAllQuizzes = async (req, res) => {
    try {
      await Quiz.deleteMany({});
      res.status(200).json({ message: 'All quizzes deleted successfully' });
    } catch (error) {
      console.error('Error deleting all quizzes:', error);
      res.status(500).json({ message: 'Failed to delete all quizzes' });
    }
  };
  exports.shareQuiz = async (req, res) => {
    try {
      const quizId = req.params.id;
  
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { shared: true },
        { new: true, runValidators: true }
      );
  
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error('Error sharing quiz:', error);
      res.status(500).json({ message: 'Failed to share quiz' });
    }
  };
  exports.unshareQuiz = async (req, res) => {
    try {
      const quizId = req.params.id;
  
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { shared: false },
        { new: true, runValidators: true }
      );
  
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error('Error unsharing quiz:', error);
      res.status(500).json({ message: 'Failed to unshare quiz' });
    }
  };
  exports.getSharedQuizzes = async (req, res) => {
    try {
      // Récupère les quizzes partagés et peuple le champ rhId avec les informations de l'utilisateur
      const quizzes = await Quiz.find({ shared: true })
        .populate({
          path: 'rhId', 
          select: 'email name' // Sélectionne uniquement les champs email et name de l'utilisateur
        })
        .exec();
  
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };