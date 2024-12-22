import "bootstrap/dist/css/bootstrap.min.css";
import "./Quiztable.css";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,
  DeleteForeverRounded,
  PlaylistAddRounded,
  VisibilityRounded,
  ShareRounded,
 
} from "@material-ui/icons";
import { Modal, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Item from "../pages/Dashboard/components/Item";
import { fetchUsers } from '../actions/UsersActions';
import { fetchUser } from '../pages/slices/userSlice';
const PAGE_SIZE = 3; // Définir la taille de la page

function QuizTable() {
  const { rhId } = useParams(); 
  const [open, setOpen] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState(null); 
  const [description, setDescription] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [time, setTime] = useState('');
  const users = useSelector(state => state.users.users || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (rhId) {
      dispatch(fetchUser(rhId));
    }
  }, [rhId, dispatch]);
  useEffect(() => {
    const percentage = calculateCompletionPercentage(user);
    if (percentage < 80) {
      navigate(`/${rhId}/UserProfile`); // Remplacez '/your-target-url' par l'URL de redirection souhaitée
    }
  }, [user, navigate]);
  useEffect(() => {
    fetchQuizzes();
    fetchAllUsers();
  }, [currentPage]);

  useEffect(() => {
    const options = users.map(user => ({
      value: user._id,
      label: user.name
    }));
    setUserOptions(options); 
  }, [users]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/quizzes/all/${rhId}?page=${currentPage}&limit=${PAGE_SIZE}`);
      const fetchedQuizzes = Array.isArray(response.data) ? response.data : [];
      setTotalQuizzes(fetchedQuizzes.length); // Définir le nombre total de quizzes
      // Calculer les indices de découpage
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedQuizzes = fetchedQuizzes.slice(startIndex, endIndex);
      setQuizzes(paginatedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchAllUsers = () => {
    dispatch(fetchUsers(rhId));
  };

  const handleDelete = async (Qid) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${Qid}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:5000/api/quizzes/delete-all');
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting all quizzes:', error);
    }
  };

  const handleView = (Qid) => {
    navigate(`/${rhId}/quiz/${Qid}`);
  };
  const handleShare = async (Qid) => {
    try {
      await axios.put(`http://localhost:5000/api/quizzes/sharequiz/${Qid}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error sharing quiz:', error);
    }
  };

  const handleUnshare = async (Qid) => {
    try {
      await axios.put(`http://localhost:5000/api/quizzes/unsharequiz/${Qid}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error unsharing quiz:', error);
    }
  };
  const handleOpenModal = (quizId) => {
    fetchAllUsers(); 
    setSelectedQuizId(quizId);
    setShowModal(true);
    setSelectedCandidate(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleAssignQuiz = async () => {
    if (!selectedCandidate || !selectedQuizId || !deadline || !time) {
      console.error('Please fill all required fields.');
      return;
    }

    const assignment = {
      Qid: selectedQuizId,
      canId: selectedCandidate.value,
      rhId,
      deadline,
      description,
      time,
      achievement: false,
    };

    // Log values before sending the request
    console.log('Selected Candidate:', selectedCandidate);
    console.log('Selected Quiz ID:', selectedQuizId);
    console.log('Deadline:', deadline);
    console.log('Description:', description);
    console.log('Time:', time);
    console.log('Sending assignment:', assignment);

    try {
      const response = await axios.post('http://localhost:5000/api/assignments/assign', assignment);
      console.log('Quiz assigned successfully:', response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error assigning quiz:', error);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalQuizzes / PAGE_SIZE);

  return (
    <div className="rhDash ">
      <div className="row">
       <Sidebar/>

        <div className="col">
          <div className="d-flex justify-content-between align-items-center p-3">
            <h2>Quizzes</h2>
            <button
              className="btn btn-primary rounded-pill"
              onClick={() => navigate(`/createQuiz/${rhId}`)}
            >
              Create a Quiz
            </button>
          </div>
          <div className="tabble-container relative-container">
            <table className="tabble table-hover">
              <thead className="thead">
                <tr>
                  <th>Title</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <tr key={quiz._id}>
                      <td>{quiz.title}</td>
                      <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDelete(quiz._id)}
                        >
                          <DeleteForeverRounded fontSize="small" />
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleView(quiz._id)}
                        >
                          <VisibilityRounded fontSize="small" />
                          <i className="bi bi-eye"></i> View
                        </button>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleOpenModal(quiz._id)}
                        >
                          <PlaylistAddRounded fontSize="small" />
                          <i className="bi bi-pencil-square"></i> Assign
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/${rhId}/updatequiz/${quiz._id}`)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        {quiz.shared ? (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleUnshare(quiz._id)}
                          >
                            <ShareRounded fontSize="small" />
                            Unshare
                          </button>
                        ) : (
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleShare(quiz._id)}
                          >
                            <ShareRounded fontSize="small" />
                            Share
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No quizzes available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className="position-bottom-left btn btn-danger btn-sm mt-3"
              onClick={handleDeleteAll}
            >
              <DeleteForeverRounded fontSize="small" />
              <i className="bi bi-trash"></i> Delete All Quizzes
            </button>
          </div>
          <br />
          <div className="dd-flex justify-content-center">
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
      
      {/* Modal for assigning quiz */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCandidates">
              <Form.Label>Select Candidate</Form.Label>
              <Select 
                options={userOptions}
                value={selectedCandidate}
                onChange={(selectedOption) => {
                  setSelectedCandidate(selectedOption);
                  fetchAllUsers(); // Call fetchAllUsers() after updating selectedCandidate
                }}
              />
            </Form.Group>
            <Form.Group controlId="formDeadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTime">
              <Form.Label>Time (in minutes)</Form.Label>
              <Form.Control
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAssignQuiz}>
            Assign Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default QuizTable;
