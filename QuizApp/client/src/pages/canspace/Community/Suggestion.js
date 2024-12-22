import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCandidates, assignQuiz } from '../../../actions/candidateActions';

const Suggestion= () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rhId } = useParams(); // Utilisation de `useParams` avec une minuscule 'u'

  const candidatesState = useSelector((state) => state.candidates);
  const { loading, candidates, error } = candidatesState;
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);
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
   
  },  rhId);


  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Select Candidate</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            {candidate.name} <button >Assign Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestion;
