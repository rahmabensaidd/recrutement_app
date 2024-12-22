import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Viewupdate = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: [{ text: '', isCorrect: false }] }]);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const {rhId, Qid } = useParams(); // Assuming you're using react-router-dom v6 or higher

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${Qid}`);
        const quiz = response.data;
        setTitle(quiz.title);
        setQuestions(quiz.questions);
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

  const handleOptionChange = (qIndex, oIndex) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === qIndex) {
        const updatedOptions = q.options.map((option, j) => ({
          ...option,
          isCorrect: j === oIndex,
        }));
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/quizzes/${Qid}`, { title, questions });
      console.log('Quiz updated:', response.data);
      navigate(`${rhId}/QuizTable`); // Replace '/QuizTable' with the path you want to navigate to after updating
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleRestart = () => {
    setTitle('');
    setQuestions([{ text: '', options: [{ text: '', isCorrect: false }] }]);
  };

  return (
    <div>
      <h2>Update Quiz</h2>
      <label htmlFor="title">Title:</label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      {questions.map((question, qIndex) => (
        <div key={qIndex}>
          <label htmlFor={`question-${qIndex}`}>Question {qIndex + 1}:</label>
          <input type="text" id={`question-${qIndex}`} value={question.text} onChange={(e) => {
            const updatedQuestions = questions.map((q, i) => (i === qIndex ? { ...q, text: e.target.value } : q));
            setQuestions(updatedQuestions);
          }} required />

          {question.options.map((option, oIndex) => (
            <div key={oIndex}>
              <label htmlFor={`option-${qIndex}-${oIndex}`}>Option {oIndex + 1}:</label>
              <input type="text" id={`option-${qIndex}-${oIndex}`} value={option.text} onChange={(e) => {
                const updatedOptions = question.options.map((o, i) => (i === oIndex ? { ...o, text: e.target.value } : o));
                const updatedQuestions = questions.map((q, i) => (i === qIndex ? { ...q, options: updatedOptions } : q));
                setQuestions(updatedQuestions);
              }} required />
              <input type="radio" name={`correct-${qIndex}`} id={`correct-${qIndex}-${oIndex}`} checked={option.isCorrect} onChange={() => handleOptionChange(qIndex, oIndex)} />
              <label htmlFor={`correct-${qIndex}-${oIndex}`}>Correct</label>
              <button type="button" onClick={() => handleRemoveOption(qIndex, oIndex)}>Remove Option</button>
            </div>
          ))}

          <button type="button" onClick={() => handleAddOption(qIndex)}>Add Option</button>
          {questions.length > 1 && <button type="button" onClick={() => handleRemoveQuestion(qIndex)}>Remove Question</button>}
        </div>
      ))}

      <button type="button" onClick={handleAddQuestion}>Add Question</button>
      <button type="button" onClick={handleSubmit}>Update Quiz</button>
      <button type="button" onClick={handleRestart}>Restart Quiz</button>
    </div>
  );
};

export default Viewupdate;
