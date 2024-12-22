import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCandidates, assignQuiz } from '../actions/candidateActions';

const CandidateList = () => {
 
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { rhId, Qid } = useParams(); // Utilisation de `useParams` avec une minuscule 'u'
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
  const candidatesState = useSelector((state) => state.candidates);
  const { loading, candidates, error } = candidatesState;

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleAssign = (canId) => {
    dispatch(assignQuiz(Qid, canId, rhId)); // Appel à assignQuiz avec les bons arguments
    navigate(`/${rhId}/assign-quiz/${Qid}/${canId}`); // Navigation correcte après attribution
  };

  return (
    <div>
      <h2>Select Candidate</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            {candidate.name} <button onClick={() => handleAssign(candidate._id)}>Assign Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;
