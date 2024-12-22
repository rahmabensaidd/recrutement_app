import React, { useState, useEffect } from 'react';
import "./ViewUpdate.css";
import axios from 'axios';
import { motion } from "framer-motion";
import { useNavigate, useParams } from 'react-router-dom';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  AttachMoneyRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,
} from "@material-ui/icons";
import Item from "../components/Item";
import Sidebar from '../../../components/Sidebar';

function Viewupdate() {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(true);
  const { rhId } = useParams(); 
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: [{ text: '', isCorrect: false }] }]);
  const [selectedCategory, setSelectedCategory] = useState(''); // État pour la catégorie sélectionnée
  const navigate = useNavigate();
  const { Qid } = useParams(); // Assuming you're using react-router-dom v6 or higher

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${Qid}`);
        const quiz = response.data;
        setTitle(quiz.title);
        setQuestions(quiz.questions);
        setSelectedCategory(quiz.category); // Mettez à jour l'état avec la catégorie récupérée
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [Qid]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: [{ text: '', isCorrect: false }] }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedOptions = [...questions[index].options, { text: '', isCorrect: false }];
    const updatedQuestions = questions.map((q, i) => (i === index ? { ...q, options: updatedOptions } : q));
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedOptions = questions[qIndex].options.filter((_, i) => i !== oIndex);
    const updatedQuestions = questions.map((q, i) => (i === qIndex ? { ...q, options: updatedOptions } : q));
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/quizzes/${Qid}`, { title, questions, category: selectedCategory });
      console.log('Quiz updated:', response.data);
      navigate(`/${rhId}/QuizTable/`);
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleRestart = () => {
    setTitle('');
    setQuestions([{ text: '', options: [{ text: '', isCorrect: false }] }]);
    setSelectedCategory(''); // Réinitialiser la catégorie sélectionnée
  };

  const handleView1 = (rhIdd) => {
    navigate(`/${rhId}/QuizTable/`);
  };
  const handleView2 = (rhIdd) => {
    navigate(`/createQuiz/${rhId}`);
  };

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${rhId}`);
        setDarkMode(response.data.darkMode); // Adjust based on your API response
      } catch (error) {
        console.error('Error fetching dark mode state:', error);
      }
    };

    fetchDarkMode();
  }, [rhId]);

  // Liste des catégories disponibles
  const categories = [
    'Développement',
    'Réseau',
    'DevOps',
    'Cloud',
    'Sécurité',
    'Psychologie',
    'Autres domaines de l\'IT'
  ];

  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar />
      <div className="body_containeer">
        <div className='connn'>
          <div className="containerr">
            <h2>Update Quiz</h2>
            <div>
              <label htmlFor="title">Title:</label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-control" 
                required 
              />

              <label htmlFor="category">Category:</label>
              <select 
                id="category" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                className="form-control" 
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>

              {questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-3">
                  <label htmlFor={`question-${qIndex}`} className="form-label">Question {qIndex + 1}:</label>
                  <input
                    type="text"
                    id={`question-${qIndex}`}
                    value={question.text}
                    onChange={(e) => {
                      const updatedQuestions = questions.map((q, i) =>
                        i === qIndex ? { ...q, text: e.target.value } : q
                      );
                      setQuestions(updatedQuestions);
                    }}
                    className="form-control"
                    required
                  />

                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="mb-2">
                      <label htmlFor={`option-${qIndex}-${oIndex}`} className="form-label">Option {oIndex + 1}:</label>
                      <input
                        type="text"
                        id={`option-${qIndex}-${oIndex}`}
                        value={option.text}
                        onChange={(e) => {
                          const updatedOptions = question.options.map((o, i) =>
                            i === oIndex ? { ...o, text: e.target.value } : o
                          );
                          const updatedQuestions = questions.map((q, i) =>
                            i === qIndex ? { ...q, options: updatedOptions } : q
                          );
                          setQuestions(updatedQuestions);
                        }}
                        className="form-control"
                        required
                      />
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id={`correct-${qIndex}-${oIndex}`}
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const updatedOptions = question.options.map((o, i) =>
                              i === oIndex ? { ...o, isCorrect: e.target.checked } : o
                            );
                            const updatedQuestions = questions.map((q, i) =>
                              i === qIndex ? { ...q, options: updatedOptions } : q
                            );
                            setQuestions(updatedQuestions);
                          }}
                          className="form-check-input"
                        />
                        <label htmlFor={`correct-${qIndex}-${oIndex}`} className="form-check-label">Correct</label>
                      </div>
                      <button type="button" onClick={() => handleRemoveOption(qIndex, oIndex)} className="btn btn-danger btn-sm mt-2">
                        Remove Option
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={() => handleAddOption(qIndex)} className="btn btn-primary btn-sm">
                    Add Option
                  </button>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="btn btn-danger btn-sm ml-2">
                      Remove Question
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={handleAddQuestion} className="btn btn-primary ml-3">
                Add Question
              </button>
              <button type="button" onClick={handleSubmit} className="btn btn-success ml-3">Update Quiz</button>
              <button type="button" onClick={handleRestart} className="btn btn-warning ml-3">Restart Quiz</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewupdate;
