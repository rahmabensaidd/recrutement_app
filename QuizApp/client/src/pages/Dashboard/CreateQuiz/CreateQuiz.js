import React, { useState, useEffect } from 'react';
import './CreateQuiz.css';
import { motion } from 'framer-motion';
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
  Add,
  Delete,
} from '@material-ui/icons';
import Item from '../components/Item';
import Sidebar from '../../../components/Sidebar';

const CreateQuiz = () => {
  const { rhId } = useParams();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: [{ text: '', isCorrect: false }] }]);
  const [selectedCategory, setSelectedCategory] = useState(''); // État pour la catégorie sélectionnée
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${rhId}`);
        setDarkMode(response.data.darkMode); // Ajustez en fonction de la réponse de votre API
      } catch (error) {
        console.error('Error fetching dark mode state:', error);
      }
    };

    fetchDarkMode();
  }, [rhId]);

  const handleAddQuestion = () => {
    const newQuestion = {
      text: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
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
      if (title.trim() === '') {
        console.error('Quiz title cannot be empty');
        return;
      }
      if (questions.some((question) => question.text.trim() === '')) {
        console.error('Each question must have a text');
        return;
      }
      if (questions.some((question) => question.options.length < 2)) {
        console.error('Each question must have at least two options');
        return;
      }
      if (selectedCategory.trim() === '') {
        console.error('Category must be selected');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/quizzes/create', { 
        title, 
        questions, 
        category: selectedCategory, 
        rhId // Inclure rhId lors de la création du quiz
      });
      console.log('Quiz created:', response.data);
      navigate(`/${rhId}/quiz-table`);
    } catch (error) {
      console.error('Error creating quiz:', error);
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

  // Liste des catégories disponibles
  const categories = [
    'Software Development',
    'IT Project Management',
    'Cybersecurity',
    'Infrastructure and Networking',
    'AI & ML',
    'Data Analysis',
    'Systems and Architecture',
    'Design and UX/UI',
    'Technical Support and Customer Service',
    'Application Development',
    'Emerging Technologies',
    'Data Management',
    'Automation and Orchestration',
    'Cloud Computing',
    'psycholgy',
  ];

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />
        
        <div className="col">
          <h2>Create Quiz</h2>
          <div className="scrollable-contentt">
            
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title:</label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-control" 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category:</label>
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
            </div>

            {questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-3">
                <label htmlFor={`question-${qIndex}`} className="form-label">Question {qIndex + 1}:</label>
                <input 
                  type="text" 
                  id={`question-${qIndex}`} 
                  value={question.text} 
                  onChange={(e) => {
                    const updatedQuestions = questions.map((q, i) => (i === qIndex ? { ...q, text: e.target.value } : q));
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
                        const updatedOptions = question.options.map((o, i) => (i === oIndex ? { ...o, text: e.target.value } : o));
                        const updatedQuestions = questions.map((q, i) => (i === qIndex ? { ...q, options: updatedOptions } : q));
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
                          const updatedOptions = question.options.map((o, i) => (i === oIndex ? { ...o, isCorrect: e.target.checked } : o));
                          const updatedQuestions = questions.map((q, i) => (i === qIndex ? { ...q, options: updatedOptions } : q));
                          setQuestions(updatedQuestions);
                        }} 
                        className="form-check-input" 
                      />
                      <label htmlFor={`correct-${qIndex}-${oIndex}`} className="form-check-label">Correct</label>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOption(qIndex, oIndex)} 
                      className="btn btn-danger btn-sm mt-2"
                    >
                      <Delete /> Remove Option
                    </button>
                  </div>
                ))}

                <button 
                  type="button" 
                  onClick={() => handleAddOption(qIndex)} 
                  className="btn btn-primary btn-sm"
                >
                  <Add /> Add Option
                </button>
                {questions.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveQuestion(qIndex)} 
                    className="btn btn-danger btn-sm ml-2"
                  >
                    <Delete /> Remove Question
                  </button>
                )}
              </div>
            ))}

            <button 
              type="button" 
              onClick={handleAddQuestion} 
              className="btn btn-primary ml-3"
            >
              <Add /> Add Question
            </button>
            <button 
              type="button" 
              onClick={handleSubmit} 
              className="btn btn-success ml-3"
            >
              Create Quiz
            </button>
            <button 
              type="button" 
              onClick={handleRestart} 
              className="btn btn-warning ml-3"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
