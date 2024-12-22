import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import './Quizresult.css';
import { fetchUser } from '../../../pages/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const QuizResult = () => {
  const { rhId,Aid } = useParams(); // Assuming Aid contains both candidateId and assignmentId
  const [resultQuiz, setResultQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const navigate= useNavigate();
  // Function to fetch quiz result
  const calculateCompletionPercentage = (user) => {
    const totalFields = 14;
    let filledFields = 0;
  
    if (user.name) filledFields++;
    if (user.email) filledFields++;
    if (user.role) filledFields++;
    if (user.personalPhoto) filledFields++;
    if (user.placeOfResidence?.city || user.placeOfResidence?.country) filledFields++;
    if (user.mobileNumber) filledFields++;
    if (user.professionalTitle) filledFields++;
    if (user.description) filledFields++;
    if (user.linkedinProfile) filledFields++;
    if (user.githubProfile) filledFields++;
    if (user.website) filledFields++;
    if (user.cvFile) filledFields++;
    if (user.languages.length > 0) filledFields++;
    if (user.recentJobPosts.length > 0) filledFields++;
  
    return (filledFields / totalFields) * 100;
  };
  useEffect(() => {
    if (rhId) {
      dispatch(fetchUser(rhId));
    }
  }, [rhId, dispatch]);
  useEffect(() => {
    const percentage = calculateCompletionPercentage(user);
    if (percentage < 80) {
      navigate(`/${rhId}/UserProfile`); // Remplacez '/your-target-url' par l'URL de redirection souhaitée
    }
  }, [user, navigate]);
  const fetchResultQuiz = async () => {
    if (!Aid) {
      setError('Invalid URL parameters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const assignmentResponse = await axios.get(`http://localhost:5000/api/assignments/assignment/${Aid}`);
      const assignment = assignmentResponse.data;

      // Extract candidateId from assignment data
      const candidateId = assignment.candidateId;
      const response = await axios.get(`http://localhost:5000/api/resultQuizzes/${candidateId._id}/${Aid}`);
      setResultQuiz(response.data); // Update resultQuiz state with fetched data
    } catch (error) {
      console.error('Error fetching result quiz:', error);
      setError('Failed to fetch quiz result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch quiz result when component mounts
  useEffect(() => {
    fetchResultQuiz();
  }, [Aid]); // Trigger fetchResultQuiz whenever Aid changes

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  // If no resultQuiz found
  if (!resultQuiz) {
    return (
      <div>
        <p>No result found</p>
        <button onClick={fetchResultQuiz}>Fetch Quiz Result</button>
      </div>
    );
  }

  // Destructure resultQuiz data with default values
  const {
    candidateId = { name: 'Candidate Name Not Found' },
    quizId = { questions: [] },
    score = 0,
    questionsAttempted = 0,
    wrongAnswers = []
  } = resultQuiz[0];

  // Calculate number of right answers
  const rightAnswers = questionsAttempted - wrongAnswers.length;

  // Calculate accuracy percentage
  const accuracy = questionsAttempted === 0 ? 0 : (rightAnswers / questionsAttempted) * 100;

  return (
    <div className='canDash'>
      <Sidebar />
      <div className="body_container">
        <div className="containerr">
          <div>
            <h2>Quiz Result</h2>
            <p><strong>Candidate Name:</strong> {candidateId.name}</p>
            <p><strong>Accuracy:</strong> {accuracy.toFixed(2)}%</p>
            <p><strong>Score:</strong> {score}</p>
            <p><strong>Number of Questions Attempted:</strong> {questionsAttempted}</p>
            <p><strong>Number of Wrong Answers:</strong> {wrongAnswers.length}</p>

            {/* Display answers with wrong answers highlighted in red */}
            <h3>Answers:</h3>
            {quizId.questions.map((question, index) => (
              <div key={question._id}>
                <p>{index + 1}. {question.text}</p>
                <ul>
                  {question.options.map(option => (
                    <li key={option._id} style={{ color: option.isCorrect ? 'green' : 'black' }}>
                      {option.text}
                    </li>
                  ))}
                </ul>
                {/* Check if there is a wrong answer for this question */}
                {wrongAnswers.find(answer => answer.question?._id === question._id) && (
                  <p style={{ color: 'red' }}>
                    Your Answer: {wrongAnswers.find(answer => answer.question?._id === question._id)?.selectedOption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
