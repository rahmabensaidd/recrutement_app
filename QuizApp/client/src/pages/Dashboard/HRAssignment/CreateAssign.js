import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,
} from '@material-ui/icons';
import Select from 'react-select';
import { fetchUsers } from '../../../actions/UsersActions';
import Item from '../components/Item';
import Sidebar from '../../../components/Sidebar';
import '../CreateQuiz/CreateQuiz.css';
const CreateAssign = () => {
  const { rhId } = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const users = useSelector(state => state.users.users); // Assuming users are stored in the Redux state

  const [newAssignment, setNewAssignment] = useState({
    Qid: '',
    canId: '',
    rhId: rhId,
    achievement: false,
    description: '',
    deadline: '',
    time: '',
  });

  const [errors, setErrors] = useState({
    Qid: '',
    canId: '',
    description: '',
    time: '',
    deadline: '',
  });
  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${rhId}`);
        setDarkMode(response.data.darkMode); // Adjust based on your API response
      } catch (error) {
        console.error('Error fetching dark mode state:', error);
      }
    };

    fetchDarkMode();

  },  rhId);
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/all/${rhId}`);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
    dispatch(fetchUsers(rhId)); // Fetch all users
  }, [dispatch, rhId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
    // Clear the corresponding error when input changes
    setErrors({ ...errors, [name]: '' });
  };

  const handleSelectChange = (selectedOption, name) => {
    setNewAssignment({ ...newAssignment, [name]: selectedOption.value });
    // Clear the corresponding error when select changes
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!newAssignment.Qid) {
      newErrors.Qid = 'Quiz ID is required.';
      valid = false;
    }

    if (!newAssignment.canId) {
      newErrors.canId = 'Candidate ID is required.';
      valid = false;
    }

    if (!newAssignment.description) {
      newErrors.description = 'Description is required.';
      valid = false;
    }

    if (!newAssignment.time) {
      newErrors.time = 'Time is required.';
      valid = false;
    } else if (isNaN(newAssignment.time) || newAssignment.time <= 0) {
      newErrors.time = 'Time must be a positive number.';
      valid = false;
    }

    if (!newAssignment.deadline) {
      newErrors.deadline = 'Deadline is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateAssignment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/assignments/assign', newAssignment);
      console.log('Assignment created:', response.data);
      navigate(`/${rhId}/TabAssign`);
    } catch (error) {
      console.error('Error creating assignment:', error);
      if (error.response && error.response.data && error.response.data.error) {
        const apiError = error.response.data.error;
        console.error('API Error:', apiError);
        // Handle specific error messages from API if needed
      } else {
        // Handle generic error if needed
      }
    }
  };

  const handleView1 = () => {
    navigate(`/${rhId}/QuizTable/`);
  };


  
  if (!users) {
    return null; // Return early or handle loading state appropriately
  }

  return (
    <div className='rhDash'>
      <div className="row">
        <Sidebar />
        
        <div className="col  ">
         <h2>Create Assignement</h2>
        <div className="scrollable-contentt ">
            <form>
              <div className="form-group">
                <label>Candidate Email</label>
                <Select
                  name="canId"
                  options={users.map(user => ({ value: user._id, label: `${user.name} (${user.email})` }))}
                  className="basic-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'canId')}
                />
                {errors.canId && <div className="invalid-feedback">{errors.canId}</div>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={newAssignment.description}
                  onChange={handleInputChange}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
              <div className="form-group">
                <label>Time (in minutes)</label>
                <input
                  type="number"
                  name="time"
                  value={newAssignment.time}
                  onChange={handleInputChange}
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                />
                {errors.time && <div className="invalid-feedback">{errors.time}</div>}
              </div>
              <div className="form-group">
                <label>Quiz Title</label>
                <Select
                  name="Qid"
                  options={quizzes.map(quiz => ({ value: quiz._id, label: quiz.title }))}
                  className="basic-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'Qid')}
                />
                {errors.Qid && <div className="invalid-feedback">{errors.Qid}</div>}
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={newAssignment.deadline}
                  onChange={handleInputChange}
                  className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                />
                {errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}
              </div>
              <button type="button" className="btn btn-primary" onClick={handleCreateAssignment}>
                Create Assignment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssign;
