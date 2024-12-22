import React, { useEffect, useState } from 'react';
import './Quiztest.css';
import Sidebarcan from '../Sidebar/Sidebarcan';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Descriptiontest() {
  const { Qid, Aid, canId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/assignments/assignment/${Aid}`);
        setAssignment(response.data);
      } catch (error) {
        setError('Failed to fetch assignment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (Aid) {
      fetchAssignment();
    } else {
      setLoading(false);
    }
  }, [Aid]);

  const handleStartQuiz = () => {
    console.log(`Navigating to /${canId}/${Aid}/${Qid}/Quizstart/`);
    navigate(`/QuizTest/${canId}/${Aid}/${Qid}/`);
  };
  if (loading) {
    return <p>Loading assignment details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!assignment) {
    return <p>No assignment found</p>;
  }

  return (
    <div className='canDash'>
      <Sidebarcan />
      <div className="body_container">
        <div className="containerr">
          <div>
            <p><strong>from:</strong> {assignment.rhId.name}</p>
           
            <p><strong>Sent Date:</strong> {new Date(assignment.sentAt).toLocaleString()}</p>
            <p><strong>Quiz Title:</strong> {assignment.quizId.title}</p>
            <p><strong>Description:</strong> {assignment.description}</p>
            <button className="btn btn-primary" onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Descriptiontest;
