import "bootstrap/dist/css/bootstrap.min.css";
import "./Assig.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../../pages/slices/userSlice';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from "../../../components/Sidebar";

const PAGE_SIZE = 6; // Define page size

function Assig() {
  const { rhId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState({
    description: '',
    time: 0,
    deadline: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);

  const calculateCompletionPercentage = (user) => {
    const totalFields = 14;
    let filledFields = 0;

    // Check each field for completion
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
      navigate(`/${rhId}/UserProfile`); // Redirect if profile completion is below 80%
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/assignments/allassignments/${rhId}?page=${currentPage}&limit=${PAGE_SIZE}`);
        const fetchedAssignments = Array.isArray(response.data) ? response.data : [];
        setTotalAssignments(fetchedAssignments.length);
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedAssignments = fetchedAssignments.slice(startIndex, endIndex);
        setAssignments(paginatedAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [currentPage, rhId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assignments/deleteAssignment/${id}`);
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleEdit = (assignment) => {
    setCurrentAssignment(assignment);
    setAssignmentDetails({
      description: assignment.description || '',
      time: assignment.time || 0,
      deadline: assignment.deadline ? new Date(assignment.deadline).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentAssignment(null);
    setAssignmentDetails({
      description: '',
      time: 0,
      deadline: '',
    });
  };

  const handleModalSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/assignments/update/${currentAssignment._id}`, {
        description: assignmentDetails.description,
        time: assignmentDetails.time,
        deadline: assignmentDetails.deadline,
      });

      setAssignments(assignments.map((assignment) =>
        assignment._id === currentAssignment._id ? { ...assignment, ...assignmentDetails } : assignment
      ));

      handleModalClose();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails({ ...assignmentDetails, [name]: value });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalAssignments / PAGE_SIZE);

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />

        <div className="col">
          <h2>Assignments</h2>
          <button
            className="btn btn-primary rounded-pill btn-custom"
            onClick={() => navigate(`/createassig/${rhId}`)}
          >
            Create Assignment
          </button>
          <br />
          <br />
          <table className="tabble table-hover">
            <thead className="thead">
              <tr>
                <th>Quiz Title</th>
                <th>Candidate Name</th>
                <th>Candidate Email</th>
                <th>Deadline</th>
                <th>Sent At</th>
                <th>Achievement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {assignments.length > 0 ? (
    assignments.map((assignment) => (
      <tr key={assignment._id}>
        <td>{assignment.quizId ? assignment.quizId.title : '-'}</td>
        <td>{assignment.candidateId ? assignment.candidateId.name : '-'}</td>
        <td>{assignment.candidateId ? assignment.candidateId.email : '-'}</td>
        <td>{assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : '-'}</td>
        <td>{assignment.sentAt ? new Date(assignment.sentAt).toLocaleDateString() : '-'}</td>
        <td style={{ color: assignment.achievement ? 'green' : 'red' }}>
          {assignment.achievement ? 'True' : 'False'}
        </td>
        <td>
          {assignment.achievement ? (
            <>
              <button
                className="btn btn-danger btn-sm mx-1"
                onClick={() => handleDelete(assignment._id)}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm mx-1"
                onClick={() => handleEdit(assignment)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm mx-1"
                onClick={() => handleDelete(assignment._id)}
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7">No assignments available</td>
    </tr>
  )}
</tbody>
          </table>
          <br />
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

      {currentAssignment && (
        <Modal show={showModal} onHide={handleModalClose} className="editmodal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="quizTitle" className="form-label">Quiz Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="quizTitle"
                  name="quizTitle"
                  value={currentAssignment.quizId?.title || '-'}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="candidateName" className="form-label">Candidate Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="candidateName"
                  name="candidateName"
                  value={currentAssignment.candidateId?.name || '-'}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="candidateEmail" className="form-label">Candidate Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="candidateEmail"
                  name="candidateEmail"
                  value={currentAssignment.candidateId?.email || '-'}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  value={assignmentDetails.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="time" className="form-label">Time</label>
                <input
                  type="number"
                  className="form-control"
                  id="time"
                  name="time"
                  value={assignmentDetails.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="deadline" className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  id="deadline"
                  name="deadline"
                  value={assignmentDetails.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Assig;
