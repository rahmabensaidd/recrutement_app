import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import './Dash.css';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from "../../../components/Sidebar";
import { fetchFriends } from '../../../actions/FriendsActions';

function Dash() {
  const { rhId } = useParams();
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0); // État pour totalResults
  const [totalAssignments, setTotalAssignments] = useState(0); // État pour totalAssignments
  const [totalFriends, setTotalFriends] = useState(0); // État pour totalFriends
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friends = useSelector(state => state.friends.friendsList);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/resultQuizzes`);
        const fetchedResults = Array.isArray(response.data) ? response.data : [];
        const paginatedResults = fetchedResults.map(result => {
          const quizQuestionsCount = result.quizId?.questions?.length || 0;
          const rightAnswers = result.questionsAttempted - result.wrongAnswers.length;
          const accuracy = result.questionsAttempted === 0 ? 0 : (rightAnswers / result.questionsAttempted) * 100;

          return {
            ...result,
            accuracy,
            totalQuestions: quizQuestionsCount, // Adding totalQuestions
          };
        });
        setResults(paginatedResults);
        setTotalResults(paginatedResults.length); // Mettre à jour totalResults
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/assignments/allassignments`);
        const fetchedAssignments = Array.isArray(response.data) ? response.data : [];
        setTotalAssignments(fetchedAssignments.length); // Mettre à jour totalAssignments
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchResults();
    fetchAssignments();
    dispatch(fetchFriends(rhId));
  }, [dispatch, rhId]);

  useEffect(() => {
    if (friends) {
      setTotalFriends(friends.length);
    }
  }, [friends]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />
        <div className="col">
          <div>
            Nombre total de résultats : {totalResults} {/* Affichage du nombre total de résultats */}
          </div>
          <div>
            Nombre total d'assignments : {totalAssignments} {/* Affichage du nombre total d'assignments */}
          </div>
          <div>
            Nombre total d'amis : {totalFriends} {/* Affichage du nombre total d'amis */}
          </div>
          <div>
            heelo
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash;
