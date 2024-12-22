import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Assignements.css';
import { useDispatch, useSelector } from 'react-redux';
import Sidebarcan from '../Sidebar/Sidebarcan';
import { fetchUser } from '../../../pages/slices/userSlice';
const PAGE_SIZE = 5; // Définir la taille de la page

const Assignments = () => {
  const { canId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [candidateLoading, setCandidateLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
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

    fetchCandidate();
  }, [canId]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/assignments/userassign/${canId}?page=${currentPage}&limit=${PAGE_SIZE}`);
        const fetchedAssignments = Array.isArray(response.data) ? response.data : [];
        setTotalAssignments(fetchedAssignments.length); // Définir le nombre total d'assignments
        // Calculer les indices de découpage
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedAssignments = fetchedAssignments.slice(startIndex, endIndex);
        setAssignments(paginatedAssignments);
        setAssignmentsLoading(false);
      } catch (err) {
        setError(err.message);
        setAssignmentsLoading(false);
      }
    };

    fetchAssignments();
  }, [canId, currentPage]);

  const handleView = (Qid, Aid) => {
    navigate(`/${canId}/${Aid}/${Qid}/Quizstart/`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalAssignments / PAGE_SIZE);

  if (candidateLoading || assignmentsLoading) {
    return <p>Loading candidate details and assignments...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="canDash d-flex min-vh-100 bg-light">
      <Sidebarcan />

      <div className="conn">
        <h2 className="text-center mb-4">Assignments for Candidate {candidate?.name || 'Not found'}</h2>
        <table className="tabble table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Quiz Title</th>
              <th>Sent At</th>
              <th>Responsible HR</th>
              <th>HR Email</th>
              <th>Deadline</th>
              <th>Achieved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No assignments found</td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.quizId?.title || 'Not found'}</td>
                  <td>{assignment.sentAt ? new Date(assignment.sentAt).toLocaleString() : 'Not found'}</td>
                  <td>{assignment.rhId?.name || 'Not found'}</td>
                  <td>{assignment.rhId?.email || 'Not found'}</td>
                  <td>{assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() + ' ' + new Date(assignment.deadline).toLocaleTimeString() : 'Not found'}</td>
                  <td>{assignment.achievement !== undefined ? (assignment.achievement ? 'True' : 'False') : 'Not found'}</td>
                  <td>
                    {!assignment.achievement && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleView(assignment.quizId?._id, assignment._id)}
                      >
                        Start Quiz
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br></br>
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
  );
};

export default Assignments;
