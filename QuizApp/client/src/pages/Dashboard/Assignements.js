import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const Assignments = () => {
  const { canId } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [candidate, setCandidate] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [candidateLoading, setCandidateLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    dispatch(fetchsuggestions());
  }, [dispatch, rhId]);
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/candidates/${canId}`);
        setCandidate(response.data);
        setCandidateLoading(false);
      } catch (err) {
        setError(err.message);
        setCandidateLoading(false);
      }
    };

    fetchCandidate();
  }, [canId]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/assignments/userassign/${canId}`);
        setAssignments(response.data);
        setAssignmentsLoading(false);
      } catch (err) {
        setError(err.message);
        setAssignmentsLoading(false);
      }
    };

    fetchAssignments();
  }, [canId]);

  const handleView = (Qid, Aid) => {
    navigate(`/QuizTest/${canId}/${Aid}/${Qid}`); // Use navigate to navigate programmatically
  };
 
  if (candidateLoading || assignmentsLoading) {
    return <p>Loading candidate details and assignments...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Assignments for Candidate {candidate.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Sent At</th>
            <th>Responsible HR</th>
            <th>HR Email</th>
            <th>Achieved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.quizId.title}</td>
              <td>{new Date(assignment.sentAt).toLocaleString()}</td>
              <td>{assignment.rhId.name}</td>
              <td>{assignment.rhId.email}</td>
              <td>{assignment.achievement ? 'true' : 'false'}</td>
              <td>
                {!assignment.achievement && (
                  <button onClick={() => handleView(assignment.quizId._id, assignment._id)}>Start Quiz</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assignments;
