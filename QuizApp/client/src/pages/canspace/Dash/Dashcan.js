import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import './Dashcan.css';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from "../../../components/Sidebar";


function Dashcan() {
  const { canId } = useParams();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [resultDetails, setResultDetails] = useState({
    score: 0,
    questionsAttempted: 0,
    timestamp: '',
    accuracy: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const navigate = useNavigate();

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
        setTotalResults(paginatedResults.length);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };
  

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />
        <div className="col">
          heelo
           </div>
      </div>
    </div>
  );
}

export default Dashcan;
