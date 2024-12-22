import React, { useEffect, useState } from 'react';
import "./ViewQuiz.css";
import "../../../components/Sidebar";
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,
} from "@material-ui/icons";
import Item from "../components/Item";
import Sidebar from '../../../components/Sidebar';

function ViewQuiz() {
  const { Qid, rhId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [open, setOpen] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0); // State to track current question index
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${Qid}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
  
    fetchQuiz();
  }, [Qid]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const handleView11 = (rhIdd) => {
    navigate(`/${rhId}/QuizTable/`);
  };



  // Handle click on Next button
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed logic here
      console.log('Quiz completed!');
      // Optionally, you can navigate or perform other actions after quiz completion
    }
  };



  return (
    <div className="rhDash">
      <Sidebar/>
      
      <div className="body_containeer">
        <div className='connn'>
          <div className="containerr">
            {/* Quiz Header */}
            <div className="quiz-header">
              <div className='t'>
                <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Title</h3>
                <div className='title' style={{ display: 'inline-block' }}>{quiz.title}</div>
              </div>
              <div className="timer">
                <span>00:00</span> {/* Timer placeholder */}
              </div>
            </div>
            {/* Progress bar */}
            <div className="progress-bar">
              <div style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}></div> {/* Dynamic width based on quiz progress */}
            </div>
            {/* Question and Options */}
            <div className="question-container">
              <div className="qnumber" style={{ display: 'inline-block' }}>{currentQuestion + 1}</div> {/* Display current question number */}
              <p style={{ display: 'inline-block', marginLeft: '10px' }}>{quiz.questions[currentQuestion].text}</p> {/* Display current question */}
            </div>
            <div className="options-container">
              {quiz.questions[currentQuestion].options.map((option, idx) => (
                <div key={idx} className={option.isCorrect ? 'option correct' : 'option'}>
                  <div className="option-number">
                    {idx + 1}
                  </div>
                  <div className="option-text">{option.text}</div>
                </div>
              ))}
            </div>
            {/* Conditional rendering of Next button */}
            {currentQuestion < quiz.questions.length - 1 && (
              <button className="next-button" onClick={handleNextQuestion}>Next</button>
            )}
            {/* Optionally, you can add completion logic here */}
            {currentQuestion === quiz.questions.length - 1 && (
              <div className="quiz-completed-message">Quiz Completed!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewQuiz;
