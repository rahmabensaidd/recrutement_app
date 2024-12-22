import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import './Results.css';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from "../../../components/Sidebar";

const PAGE_SIZE = 5;

function Results() {
  const { rhId } = useParams();
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
        const response = await axios.get(`http://localhost:5000/api/resultQuizzes/results/recruiter/${rhId}`);
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

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${rhId}`);
        const recruiter = response.data;
        setRecruiterEmail(recruiter.email);
        setRecruiterName(recruiter.name);
      } catch (error) {
        console.error('Error fetching recruiter details:', error);
      }
    };

    fetchRecruiterDetails();
  }, [rhId]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = results;

      if (candidateEmail) {
        filtered = filtered.filter(result => result.candidateId?.email?.toLowerCase().includes(candidateEmail.toLowerCase()));
      }

      if (quizTitle) {
        filtered = filtered.filter(result => result.quizId?.title?.toLowerCase().includes(quizTitle.toLowerCase()));
      }

      setFilteredResults(filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
    };

    applyFilters();
  }, [results, candidateEmail, quizTitle, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };
  const handleRecruiterAction = async (resultId) => {
    const result = results.find(result => result._id === resultId);
    
    console.log('Result:', result);
    
    if (result && result.candidateId) {
      console.log('Recruiter Email:', recruiterEmail);
      console.log('Candidate Email:', result.candidateId.email);
      console.log('Candidate Name:', result.candidateId.name);
      console.log('Recruiter Name:', recruiterName);
    }
    
  };
  

  const uniqueEmails = [...new Set(results.map(result => result.candidateId?.email).filter(Boolean))];
  const uniqueQuizTitles = [...new Set(results.map(result => result.quizId?.title).filter(Boolean))];

  const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />

        <div className="col">
          <h2>Results</h2>
          <div className="filters mb-3">
            <div className="row">
              <div className="col">
                <select
                  className="form-select"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                >
                  <option value="">Select Candidate Email</option>
                  {uniqueEmails.map(email => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                >
                  <option value="">Select Quiz Title</option>
                  {uniqueQuizTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
          <table className="tabble tabble-hover">
            <thead className="thead">
              <tr>
                <th>Quiz Title</th>
                <th>Candidate Name</th>
                <th>Questions Attempted</th>
                <th>Timestamp</th>
                <th>Accuracy</th>
                <th>Candidate Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <tr key={result._id}>
                    <td>{result.quizId?.title || '-'}</td>
                    <td>{result.candidateId?.name || '-'}</td>
                    <td>{result.questionsAttempted} / {result.totalQuestions || '-'}</td>
                    <td>{new Date(result.timestamp).toLocaleString()}</td>
                    <td>{result.accuracy.toFixed(2)}%</td>
                    <td>{result.candidateId?.email || '-'}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm mx-1"
                        onClick={() => handleNavigate(`/${rhId}/ViewProfile/${result.candidateId?._id}`)}
                      >
                        Profile
                      </button>
                        
                      <button
                        className="btn btn-success btn-sm mx-1"
                        onClick={() => navigate(`/resultt/${result._id}`)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No results available</td>
                </tr>
              )}
            </tbody>
          </table></div>
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
