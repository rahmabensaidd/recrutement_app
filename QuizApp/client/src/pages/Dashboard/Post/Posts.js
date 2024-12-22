import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from "../../../components/Sidebar";
import "./Posts.css";

function Posts() {
  const { rhId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // State for view modal
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [jobType, setJobType] = useState('Full-Time');
  const [salary, setSalary] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [refresh, setRefresh] = useState(false); // Add state for triggering re-fetch

  useEffect(() => {
    // Fetch job posts for the recruiter
    const fetchJobPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/myall/${rhId}`);
        if (response.data.success) {
          setJobPosts(response.data.posts);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des job posts :", error);
      }
    };

    fetchJobPosts();
  }, [rhId, refresh]); // Refresh data when `refresh` state changes

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleViewShow = () => setShowViewModal(true);
  const handleViewClose = () => setShowViewModal(false);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/posts/createpost', {
        jobTitle,
        jobType,
        salary,
        vacancies,
        experience,
        location,
        description,
        rhId,
        canId: [] // Logic for selecting candidates can be added here
      });

      if (response.data.success) {
        setRefresh(!refresh); // Trigger a refresh to get the updated list
      }

      handleClose();

    } catch (error) {
      console.error("Erreur lors de la création du job post :", error);
      // Handle error here, e.g., show an error message
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/delete-myall/${rhId}`);

      if (response.data.success) {
        setJobPosts([]);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les job posts :", error);
      // Handle error here, e.g., show an error message
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Erreur lors de la suppression du job post :", error);
      // Handle error here, e.g., show an error message
    }
  };

  const handleView = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}`);
      if (response.data.success) {
        console.log(response.data.post); // Log des données
        setSelectedPost(response.data.post);
        handleViewShow();
      }
    } catch (error) {
      console.error("Error fetching job post details:", error);
    }
  };

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />

        <div className="col">
          <h2>My Posts</h2>
          <button
            className="btn btn-primary rounded-pill btn-custom"
            onClick={handleShow}
          >
            Create Job Post
          </button>

          <br />
          <br />
          <table className="tabble tabble-hover">
            <thead className="thead">
              <tr>
                <th>Post Title</th>
                <th>Location</th>
                <th>Creation Date</th>
                <th>Number of Candidates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobPosts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No posts found</td>
                </tr>
              ) : (
                jobPosts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.jobTitle}</td>
                    <td>{post.location}</td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td> {/* Assuming you have a `createdAt` field */}
                    <td>{post.canId.length}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="info"
                        onClick={() => handleView(post._id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <br />
          <button
            className="btn btn-warning rounded-pill btn-custom"
            onClick={handleDeleteAll}
          >
            Delete All Posts
          </button>
          <div className="d-flex justify-content-center">
            <nav>
              {/* Pagination can go here */}
            </nav>
          </div>
        </div>
      </div>

      {/* Modal for Creating Job Post */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Job Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="jobTitle">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="jobType">
                  <Form.Label>Job Type</Form.Label>
                  <Form.Control 
                    as="select"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="salary">
                  <Form.Label>Salary (USD)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. 1500"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="vacancies">
                  <Form.Label>No. of Vacancies</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="vacancies"
                    value={vacancies}
                    onChange={(e) => setVacancies(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="experience">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control 
                    as="select"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="location">
                  <Form.Label>Job Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. New York"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label>Job Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Viewing Job Post Details */}
      <Modal show={showViewModal} onHide={handleViewClose}>
        <Modal.Header closeButton>
          <Modal.Title>Job Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost ? (
            <div>
              <h5>{selectedPost.jobTitle}</h5>
              <p><strong>Job Type:</strong> {selectedPost.jobType}</p>
              <p><strong>Salary:</strong> ${selectedPost.salary}</p>
              <p><strong>Vacancies:</strong> {selectedPost.vacancies}</p>
              <p><strong>Experience Required:</strong> {selectedPost.experience}</p>
              <p><strong>Location:</strong> {selectedPost.location}</p>
              <p><strong>Description:</strong></p>
              <p>{selectedPost.description}</p>
              <p><strong>Candidate Details:</strong></p>
              {selectedPost.canId && selectedPost.canId.length > 0 ? (
                <ul>
                 {selectedPost.canId.map((candidate) => (
            <li key={candidate._id}>
              <strong>Name:</strong> {candidate.name || 'N/A'} <br />
              <strong>Email:</strong> {candidate.email || 'N/A'}
            </li>
          ))}
                </ul>
              ) : (
                <p>No candidates available</p>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Posts;
