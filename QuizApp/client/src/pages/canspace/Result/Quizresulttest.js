import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebarcan from '../Sidebar/Sidebarcan';
import './Quizresult.css';
const Quizresulttest = () => {
  const { canId, Rid } = useParams(); // Assuming the candidate ID and result quiz ID are passed as route parameters
  const [resultQuiz, setResultQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Function to fetch quiz result
  const fetchResultQuiz = async () => {
    if (!canId || !Rid) {
      setError('Invalid URL parameters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/result/${Rid}`);
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
  }, [canId, Rid]); // Trigger fetchResultQuiz whenever canId or Rid changes

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
  } = resultQuiz;

  // Calculate number of right answers
  const rightAnswers = questionsAttempted - wrongAnswers.length;

  // Calculate accuracy percentage
  const accuracy = questionsAttempted === 0 ? 0 : (rightAnswers / questionsAttempted) * 100;

 

  return (
    <div className='canDash'>
      <Sidebarcan />
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



export default Quizresulttest;
