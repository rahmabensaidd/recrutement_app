import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import './Quizresult.css';

const QuizResultt = () => {
  const { Rid } = useParams(); // Assuming Rid is the result ID
  const [resultQuiz, setResultQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch quiz result
  const fetchResultQuiz = async () => {
    if (!Rid) {
      setError('Invalid URL parameters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/resultQuizzes/${Rid}`);
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
  }, [Rid]); // Trigger fetchResultQuiz whenever Rid changes

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
    candidateId = {},
    quizId = { questions: [] },
    score = 0,
    questionsAttempted = 0,
    wrongAnswers = []
  } = resultQuiz;

  const {
    name = 'Candidate Name Not Found',
    email = 'Email Not Found'
  } = candidateId;

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

            <p><strong>Candidate Email:</strong> {email}</p>
            <p><strong>Accuracy:</strong> {accuracy.toFixed(2)}%</p>
            <p><strong>Score:</strong> {score}</p>
            <p><strong>Number of Questions Attempted:</strong> {questionsAttempted}</p>
            <p><strong>Number of Wrong Answers:</strong> {wrongAnswers.length}</p>

            {/* Display answers with wrong answers highlighted in red */}
            <h3>Answers:</h3>
            {quizId.questions.map((question) => (
              <div key={question._id}>
                <p>{question.text}</p>
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

export default QuizResultt;
