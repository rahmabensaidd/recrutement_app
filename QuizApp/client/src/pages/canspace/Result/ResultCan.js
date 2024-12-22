import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import Sidebarcan from '../Sidebar/Sidebarcan';
import './ResultCan.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchUser } from '../../../pages/slices/userSlice';

const ResultCan = () => {
  const { canId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [results, setResults] = useState([]);
  const [candidateLoading, setCandidateLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const user = useSelector(state => state.user.data);
  const dispatch=useDispatch();
  const calculateCompletionPercentage = (user) => {
     const totalFields = 14;
     let filledFields = 0;
   
     if (user.name) filledFields++;
     if (user.email) filledFields++;
     if (user.role) filledFields++;
     if (user.personalPhoto) filledFields++;
     if (user.placeOfResidence?.city || user.placeOfResidence?.country) filledFields++;
     if (user.mobileNumber) filledFields++;
     if (user.professionalTitle) filledFields++;
     if (user.description) filledFields++;
     if (user.linkedinProfile) filledFields++;
     if (user.githubProfile) filledFields++;
     if (user.website) filledFields++;
     if (user.cvFile) filledFields++;
     if (user.languages.length > 0) filledFields++;
     if (user.recentJobPosts.length > 0) filledFields++;
   
     return (filledFields / totalFields) * 100;
   };
   useEffect(() => {
     if (canId) {
       dispatch(fetchUser(canId));
     }
   }, [canId, dispatch]);
   useEffect(() => {
     const percentage = calculateCompletionPercentage(user);
     if (percentage < 80) {
       navigate(`/${canId}/UserProfilee`); // Remplacez '/your-target-url' par l'URL de redirection souhaitée
     }
   }, [user, navigate]);
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

    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/resultQuizzes/can/${canId}/canresult`);
        setResults(response.data);
        if (response.data.length === 0) {
          setNoResultsFound(true);
        }
        setResultsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNoResultsFound(true);
        } else {
          setError(err.message);
        }
        setResultsLoading(false);
      }
    };

    fetchCandidate();
    fetchResults();
  }, [canId]);

  const isThisWeek = (date) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return date >= startOfWeek && date <= endOfWeek;
  };

  const currentWeekResults = results.filter((result) =>
    isThisWeek(new Date(result.timestamp))
  );

  const bestResults = results.filter((result) => {
    const questionsAttempted = result.questionsAttempted || 0;
    const rightAnswers = questionsAttempted - (result.wrongAnswers.length || 0);
    const accuracy = questionsAttempted === 0 ? 0 : (rightAnswers / questionsAttempted) * 100;
    return accuracy > 80;
  });

  if (candidateLoading || resultsLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const handleViewResult = (Rid) => {
    navigate(`/${canId}/ViewResult/${Rid}`);
  };

  return (
    <div className="canDash d-flex min-vh-100 bg-light">
      <Sidebarcan />
      <div className="conn">
        <h2 className="text-center mb-4">Your Results</h2>
        <div className="results-wrapper">
          <div className="results-container">
            {noResultsFound ? (
              <div>No results found</div>
            ) : (
              results.map((result) => (
                <motion.div
                  key={result._id}
                  className="card result-card"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{result.quizId ? result.quizId.title : 'Not found'}</h5>
                    <p className="card-text">Score: {result.score}</p>
                    <p className="card-text">Date: {new Date(result.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="view-quiz-button"
                    onClick={() => handleViewResult(result._id)}
                  >
                    View Result
                  </button>
                </motion.div>
              ))
            )}
          </div>
          <div className="bottom-row">
            <div className="bottom-div">
              <h4>Best Results</h4>
              <div className="week-results">
                <Slider {...settings}>
                  {bestResults.map((result, index) => (
                    <div key={index} className="newdiv">
                      <div className="week-card">
                        <div className="card-body">
                          <h5 className="card-title">{result.quizId ? result.quizId.title : 'Not found'}</h5>
                          <p className="card-text">Score: {result.score}</p>
                          <p className="card-text">Date: {new Date(result.timestamp).toLocaleDateString()}</p>
                          <button
                            className="view-quiz-buttonn"
                            onClick={() => handleViewResult(result._id)}
                          >
                            View Result
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCan;
