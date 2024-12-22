import React, { useEffect, useState } from 'react';
import './Quiztest.css';
import Sidebarcan from '../Sidebar/Sidebarcan';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Quiztest() {
  const { Qid, Aid, canId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
  const [progress, setProgress] = useState(0); // Progress bar percentage
  const [durationInMinutes, setDurationInMinutes] = useState(0);
  const [assignmentId, setAssignmentId] = useState(null); // State to hold assignment ID

  useEffect(() => {
    if (Qid && Aid) {
      const fetchQuizAndAssignment = async () => {
        try {
          const [quizResponse, assignmentResponse] = await Promise.all([
            axios.get(`http://localhost:5000/api/quizzes/${Qid}`),
            axios.get(`http://localhost:5000/api/assignments/assignment/${Aid}`)
          ]);

          setQuiz(quizResponse.data);
          setAnswers(new Array(quizResponse.data.questions.length).fill(null));
          setAssignmentId(Aid);

          const duration = assignmentResponse.data.time;
          setDurationInMinutes(duration);
          setTimeLeft(duration * 60);
        } catch (error) {
          console.error('Error fetching quiz or assignment:', error);
          setError('Failed to fetch quiz or assignment. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchQuizAndAssignment();
    } else {
      setLoading(false);
    }
  }, [Qid, Aid]);

  useEffect(() => {
    if (timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          const newTimeLeft = prevTimeLeft - 1;
          setProgress(((durationInMinutes * 60 - newTimeLeft) / (durationInMinutes * 60)) * 100);
          return newTimeLeft;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timeLeft === 0) {
      if (answers.every(answer => answer !== null)) {
     
      } else {
        console.log('Time is up but not all questions are answered.');
      
      }
    }
  }, [timeLeft, durationInMinutes, answers]);

  const handleOptionClick = (questionIndex, optionIndex, isCorrect) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentQuestion(prev => prev + 1);
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      const question = quiz.questions[index];
      const selectedOption = question.options[answer];
      return score + (selectedOption && selectedOption.isCorrect ? 1 : 0);
    }, 0);
  };

  const getWrongAnswers = () => {
    return quiz.questions
      .map((question, index) => {
        const selectedOptionIndex = answers[index];
        const selectedOption = selectedOptionIndex !== null ? question.options[selectedOptionIndex].text : null;
        const isCorrect = question.options[selectedOptionIndex]?.isCorrect;
        return {
          question: question.text, // Include the question text
          selectedOption: selectedOption,
          isCorrect: isCorrect,
        };
      })
      .filter(answer => !answer.isCorrect);
  };

  const handleSubmit = async () => {
    try {
      const score = calculateScore();
      const wrongAnswers = getWrongAnswers();

      const response = await axios.post('http://localhost:5000/api/resultQuizzes/', {
        candidateId: canId,
        quizId: Qid,
        assignmentId: Aid,
        score: score,
        questionsAttempted: quiz.questions.length,
        wrongAnswers: wrongAnswers,
      });

      await updateAssignment(assignmentId);
      navigate(`/${canId}/ViewResult/${response.data._id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const updateAssignment = async (assignmentId) => {
    try {
      await axios.put(`http://localhost:5000/api/assignments/update/${assignmentId}`, {
        achievement: true,
      });
    } catch (error) {
      setError('Failed to update assignment. Please try again.');
    }
  };

 

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!quiz) {
    return <p>No quiz found</p>;
  }

  return (
    <div className='canDash'>
      <Sidebarcan />
      <div className="body_container">
        <div className="containerr">
          <div className="quiz-header">
            <div className='t'>
              <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Title</h3>
              <div className='title' style={{ display: 'inline-block' }}>{quiz.title}</div>
            </div>
            <div className="timer">
              <span>{`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}</span>
            </div>
          </div>

          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}></div>
          </div>

          <div className="question-container">
            <div className="qnumber" style={{ display: 'inline-block' }}>{currentQuestion + 1}</div>
            <p style={{ display: 'inline-block', marginLeft: '10px' }}>{quiz.questions[currentQuestion].text}</p>
          </div>

          <div className="options-container">
            {quiz.questions[currentQuestion].options.map((option, idx) => (
              <div
                key={idx}
                className={`optionn ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => handleOptionClick(currentQuestion, idx, option.isCorrect)}
              >
                <div className="optionn-number">
                  {idx + 1}
                </div>
                <div className="optionn-text" style={{ color: 'black' }}>{option.text}</div>
              </div>
            ))}
          </div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button className="next-button" onClick={handleNext}>Next</button>
          ) : (
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiztest;
