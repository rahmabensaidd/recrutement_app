import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MDBRow, MDBCol, MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardFooter, MDBBtn } from 'mdb-react-ui-kit'; 
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import Sidebarcan from '../Sidebar/Sidebarcan';
import './Trainyourself.css';  // Import the CSS file
import softwareDevelopmentImg from '../images/pexels-photo-546819.jpeg';
import aiim from '../images/AI-ML-Use-Cases_blog.jpg';
import itmanager from '../images/blogpost_image_program-manager-vs-project-manager.jpg';
import cyber from '../images/Cybersecurity-Regulation-768x384.jpg';
import network from '../images/infrastructure00.jpg';
import data from '../images/data-analytics.jpg';
import system from '../images/5d67b08a4c118e0c9c6928ea_salary-of-a-senior-system-architect.jpg';
import ui from '../images/blog-ui-ux-150223.jpg';
import tek  from'../images/images.png';
import bloc from '../images/what-is-blockchain-1.jpg';
import auto from '../images/network-automation-orchestration.jpg';
import ist from '../images/iStock-963131214-1024x683.jpg';
import sy from '../images/9ef9ece54da3beb8216be13abf6bcc125e439ca9.jpg';

import { fetchUser } from '../../../pages/slices/userSlice';
const categoryImages = {
  'Software Development': softwareDevelopmentImg,
  'IT Project Management': itmanager,
  'Cybersecurity': cyber,
  'Infrastructure and Networking': network,
  'AI & ML': aiim,
  'Data Analysis': data,
  'Systems and Architecture': system,
  'Design and UX/UI': ui,
  'Technical Support and Customer Service': tek,
  'Emerging Technologies': bloc,
  'Data Management': data,
  'Automation and Orchestration': auto,
  'Cloud Computing': ist,
};

const Trainyourself = () => {
  const { canId } = useParams();
  const user = useSelector(state => state.user.data);
const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sharedQuizzes, setSharedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
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
    const fetchSharedQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes/shared');
        setSharedQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSharedQuizzes();
  }, []);

  const filteredQuizzes = selectedCategory
    ? sharedQuizzes.filter(quiz => quiz.category === selectedCategory)
    : sharedQuizzes;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleStartQuiz = (Qid) => {
    navigate(`/${canId}/test/${Qid}`);
  };

  return (
    <div className="canDash d-flex min-vh-100 bg-light">
      <Sidebarcan />

      <div className="conn">
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-3'>
              <div className="radio-buttons-column">
                <h4>Select category</h4>
                {Object.keys(categoryImages).map(category => (
                  <div className="form-check" key={category}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="options"
                      value={category}
                      id={category}
                      checked={selectedCategory === category}
                      onChange={handleCategoryChange}
                    />
                    <label className="form-check-label" htmlFor={category}>
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className='col-md-9'>
              <div className="main-content flex-grow-1">
                <h2 className="text-center mb-4">Train yourself</h2>
                <div className='scrolling-content'>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error: {error}</p>
                  ) : (
                    <MDBRow className='row-cols-1 row-cols-md-2 row-cols-lg-3 g-3'>
                      {filteredQuizzes.map(quiz => (
                        <MDBCol key={quiz._id} className='card-container'>
                          <MDBCard className='h-100'>
                            <MDBCardImage
                              src={categoryImages[quiz.category] || 'default-image-url'}
                              alt={quiz.category}
                              position='top'
                              className='card-img'
                            />
                            <MDBCardBody>
                              <MDBCardTitle style={{ fontSize: '1rem' }}>{quiz.title}</MDBCardTitle>
                              <MDBCardText style={{ fontSize: '0.9rem' }}>{quiz.category}</MDBCardText>
                            </MDBCardBody>
                            <MDBCardFooter>
                              <small className='text-muted' style={{ fontSize: '0.8rem' }}>{quiz.rhId.email}</small>
                            </MDBCardFooter>
                            <Button className='card-btn' color='primary' onClick={() => handleStartQuiz(quiz._id)}>
                              Start quiz
                            </Button>
                          </MDBCard>
                        </MDBCol>
                      ))}
                    </MDBRow>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainyourself;
