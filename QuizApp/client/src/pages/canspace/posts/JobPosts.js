import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter
} from 'mdb-react-ui-kit';
import Sidebarcan from "../Sidebar/Sidebarcan";
import { fetchUser } from '../../../pages/slices/userSlice';
function JobPosts() {
  const { canId } = useParams(); // ID du candidat extrait de l'URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [postulatedJobs, setPostulatedJobs] = useState(new Set()); // Utilisation d'un Set pour stocker les IDs des postes où le candidat a postulé
  const user = useSelector(state => state.user.data);
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
  // Fetch job posts
  useEffect(() => {
    axios.get('http://localhost:5000/api/posts/all')
      .then(response => {
        const posts = response.data.jobPosts;
        setJobPosts(posts);
        // Vérifier si le candidat a postulé pour ces postes
        const postulatedSet = new Set(posts.filter(post => post.canId.includes(canId)).map(post => post._id));
        setPostulatedJobs(postulatedSet);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [canId]);

  // Filtrage des offres d'emploi
  const filteredJobPosts = jobPosts.filter(post =>
    post.jobTitle.toLowerCase().includes(searchKeyword.toLowerCase()) &&
    post.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
    (selectedExperience === '' || post.experience === selectedExperience) &&
    (selectedJobType === '' || post.jobType.toLowerCase() === selectedJobType.toLowerCase())
  );

  // Fonction pour postuler
  const postulate = async (jobPostId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${canId}/postcan/${jobPostId}`);
      setPostulatedJobs(prev => new Set(prev).add(jobPostId));
      alert('Candidat ajouté avec succès');
    } catch (error) {
      console.error('Erreur:', error.response ? error.response.data : error.message);
      alert('Erreur lors de l\'ajout du candidat');
    }
  };

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebarcan />
        <div className="conn">
          <div className='container-fluid'>
            <div className='row'>
              {/* Sidebar avec filtres */}
              <div className='col-md-3'>
                <div className="filter-section">
                  <h5>Filter by Experience</h5>
                  <Form.Check
                    type="radio"
                    label="All"
                    name="experience"
                    value=""
                    checked={selectedExperience === ''}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Junior (0-2 years)"
                    name="experience"
                    value="Junior"
                    checked={selectedExperience === 'Junior'}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Mid (2-5 years)"
                    name="experience"
                    value="Mid"
                    checked={selectedExperience === 'Mid'}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Senior (5+ years)"
                    name="experience"
                    value="Senior"
                    checked={selectedExperience === 'Senior'}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                  />

                  <h5 className="mt-4">Filter by Job Type</h5>
                  <Form.Check
                    type="radio"
                    label="All"
                    name="jobType"
                    value=""
                    checked={selectedJobType === ''}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Full-time"
                    name="jobType"
                    value="Full-time"
                    checked={selectedJobType === 'Full-time'}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Part-time"
                    name="jobType"
                    value="Part-time"
                    checked={selectedJobType === 'Part-time'}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Contract"
                    name="jobType"
                    value="Contract"
                    checked={selectedJobType === 'Contract'}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                  />
                </div>
              </div>

              {/* Contenu principal avec barre de recherche et cartes de job */}
              <div className='col-md-9'>
                <div className="main-content flex-grow-1">
                  {/* Barre de recherche */}
                  <Form className="mb-4">
                    <Row>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          placeholder="Search for jobs by keyword"
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          placeholder="Search for jobs by location"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Form>

                  {/* Cartes de job */}
                  <div className='scrolling-content'>
                    {loading ? (
                      <p>Loading...</p>
                    ) : error ? (
                      <p>Error: {error}</p>
                    ) : (
                      <MDBRow className='row-cols-1 row-cols-md-2 row-cols-lg-3 g-3'>
                        {filteredJobPosts.map(post => (
                          <MDBCol key={post._id} className='card-container'>
                            <MDBCard className='h-100'>
                              <MDBCardBody>
                                <MDBCardTitle style={{ fontSize: '1rem' }}>{post.jobTitle}</MDBCardTitle>
                                <MDBCardText style={{ fontSize: '0.9rem' }}>{post.jobType}</MDBCardText>
                                <MDBCardText style={{ fontSize: '0.9rem' }}>{post.experience} Years Experience</MDBCardText>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1px' }}>
                                  {postulatedJobs.has(post._id) ? (
                                    <Button
                                      className='cardd-btn'
                                      style={{ 
                                        backgroundColor: 'grey', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '8px 20px', 
                                        marginLeft: '3%',
                                        fontSize: '0.9rem', 
                                        borderRadius: '40px',  // Pour l'effet pillule
                                      }}
                                    >
                                      Postulated
                                    </Button>
                                  ) : (
                                    <Button
                                      className='cardd-btn'
                                      style={{ 
                                        backgroundColor: 'red', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '8px 20px', 
                                        marginLeft: '3%',
                                        fontSize: '0.9rem', 
                                        borderRadius: '40px',  // Pour l'effet pillule
                                      }}
                                      onClick={() => postulate(post._id)}
                                    >
                                      Postulate
                                    </Button>
                                  )}
                                </div>
                              </MDBCardBody>
                              <MDBCardFooter>
                                <small className='text-muted' style={{ fontSize: '0.8rem' }}>{post.rhId.email}</small>
                              </MDBCardFooter>
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
    </div>
  );
}

export default JobPosts;
