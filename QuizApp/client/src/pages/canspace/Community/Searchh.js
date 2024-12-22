import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Search.css';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchUsers } from '../../../actions/UsersActions';
import Sidebarcan from '../Sidebar/Sidebarcan';
import {  sendRequest, cancelRequest } from '../../../actions/suggActions';
const Searchh = () => {
  const { canId } = useParams();

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    company: '',
    country: '',
    city: '',
    language: '',
    professionalTitle: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const [requestStatuses, setRequestStatuses] = useState({});
  const usersState = useSelector((state) => state.users);
  const {users} = usersState;
  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${canId}`);
        setDarkMode(response.data.darkMode); // Adjust based on your API response
      } catch (error) {
        console.error('Error fetching dark mode state:', error);
      }
    };

    fetchDarkMode();

  },  canId);
  useEffect(() => {
    dispatch(fetchUsers(canId));
  }, [dispatch]);


  useEffect(() => {
    const fetchStatuses = async () => {
      const resultsWithStatuses = await Promise.all(users.map(async (user) => {
        const status = await checkFriendStatus(canId, user._id);
        return { ...user, status };
      }));

      setSearchResults(resultsWithStatuses);
    };

    fetchStatuses();
  }, [users, canId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    handleSearch({ ...filters, [name]: value });
  };

  const handleSearch = async (updatedFilters) => {
    let filteredResults = users;

    const normalizeString = (str) => str?.toLowerCase().trim() || '';

    if (updatedFilters.name) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.name).includes(normalizeString(updatedFilters.name))
      );
    }
    if (updatedFilters.email) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.email).includes(normalizeString(updatedFilters.email))
      );
    }
    if (updatedFilters.mobileNumber) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.mobileNumber).includes(normalizeString(updatedFilters.mobileNumber))
      );
    }
    if (updatedFilters.company) {
      filteredResults = filteredResults.filter((user) =>
        user.recentJobPosts.some((job) =>
          normalizeString(job.company).includes(normalizeString(updatedFilters.company))
        )
      );
    }
    if (updatedFilters.country) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.country).includes(normalizeString(updatedFilters.country))
      );
    }
    if (updatedFilters.city) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.city).includes(normalizeString(updatedFilters.city))
      );
    }
    if (updatedFilters.language) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.language).includes(normalizeString(updatedFilters.language))
      );
    }
    if (updatedFilters.professionalTitle) {
      filteredResults = filteredResults.filter((user) =>
        normalizeString(user.professionalTitle).includes(normalizeString(updatedFilters.professionalTitle))
      );
    }
    const resultsWithStatuses = await Promise.all(filteredResults.map(async (user) => {
      const status = await checkFriendStatus(canId, user._id);
      return { ...user, status };
    }));
  
    setSearchResults(resultsWithStatuses);
  };
  
    const fetchStatuses = async () => {
      const resultsWithStatuses = await Promise.all(users.map(async (user) => {
        const status = await checkFriendStatus(canId, user._id);
        return { ...user, status };
      }));
    
      setSearchResults(resultsWithStatuses);
    };
    
    const checkFriendStatus = async (userId, otherId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/voirstatus/${userId}/${otherId}`);
        return response.data.status;
      } catch (error) {
        console.error('Error fetching friend status:', error);
        return 'error';
      }
    };
  const handleViewfriends = () => {
    navigate(`/${canId}/friendss/`);
  };

  const handleViewProfile = (canIdd) => {
    navigate(`/${canId}/ViewProfile/${canIdd}`);
  };

  const handleviewsugg = () => {
    navigate(`/${canId}/userlistt/`);
  };

  const handleViewSearch = () => {
    navigate(`/${canId}/Searchh`);
  };

  const handleViewrequests = () => {
    navigate(`/${canId}/requests/`);
  };

  
  const handleSendRequest = (recipientId) => {
    dispatch(sendRequest(canId, recipientId))
      .then(() => {
        setRequestStatuses((prevState) => ({
          ...prevState,
          [recipientId]: 'pending',
        }));
      })
      .catch((error) => {
        console.error('Error sending request:', error);
      });
  };
  const handleDeleteFriend = (otherId) => {
    // Code to delete a friend
  };

  const handleAcceptRequest = (otherId) => {
    // Code to accept a friend request
  };

  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebarcan />
      <div className="body_container">
        <div className="conn">
          <div className='buttons' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleviewsugg}>Suggestions</button>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewrequests}>requests</button>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewfriends}>Friends</button>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewSearch}>Search</button>
          </div>
          <div className="content-wrapper">
            <div className="table">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Professional Title</th>
                    <th>Last Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((candidate) => {
                    const lastJob = candidate.recentJobPosts.length > 0 ? candidate.recentJobPosts[candidate.recentJobPosts.length - 1] : null;

                    return (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.professionalTitle}</td>
                        <td>{lastJob ? lastJob.company : 'N/A'}</td>
                        <td>
  <div className="buttons">
    <button className="but" onClick={() => handleViewProfile(candidate._id)}>
      View Profile
    </button>
    {candidate.status === 'sendOrNo' && (
      <button className="but" onClick={() => handleSendRequest(canId)}>
        Send Request
      </button>
    )}
    {candidate.status === 'friend' && (
      <button className="but" onClick={() => handleDeleteFriend(candidate._id)}>
        Delete Friend
      </button>
    )}
    {candidate.status === 'acceptOrNo' && (
      <button className="but" onClick={() => handleAcceptRequest(candidate._id)}>
        Accept Request
      </button>
    )}
  </div>
</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="recherche">
  <h3>Search Filters</h3>

  <div className="filter-group">
    <label htmlFor="name">Name:</label>
    <input
      type="text"
      id="name"
      name="name"
      value={filters.name}
      onChange={handleChange}
      placeholder="Search by Name"
    />
  </div>

  <div className="filter-group">
    <label htmlFor="email">Email:</label>
    <input
      type="text"
      id="email"
      name="email"
      value={filters.email}
      onChange={handleChange}
      placeholder="Search by Email"
    />
  </div>

  <div className="filter-group">
    <label htmlFor="mobileNumber">Phone Number:</label>
    <input
      type="text"
      id="mobileNumber"
      name="mobileNumber"
      value={filters.mobileNumber}
      onChange={handleChange}
      placeholder="Search by Mobile Number"
    />
  </div>

  <div className="filter-group">
    <label htmlFor="company">Company:</label>
    <input
      type="text"
      id="company"
      name="company"
      value={filters.company}
      onChange={handleChange}
      placeholder="Search by Company"
    />
  </div>

  <div className="filter-group">
    <label htmlFor="country">Country:</label>
    <select
      id="country"
      name="country"
      value={filters.country}
      onChange={handleChange}
    >
      <option value="">Select Country</option>
      <optgroup label="North America">
        <option value="USA">United States</option>
        <option value="Canada">Canada</option>
        <option value="Mexico">Mexico</option>
        <option value="Jamaica">Jamaica</option>
        <option value="Costa Rica">Costa Rica</option>
        {/* Add more North American countries as needed */}
      </optgroup>
      <optgroup label="Europe">
        <option value="UK">United Kingdom</option>
        <option value="Germany">Germany</option>
        <option value="France">France</option>
        <option value="Italy">Italy</option>
        <option value="Spain">Spain</option>
        {/* Add more European countries as needed */}
      </optgroup>
      <optgroup label="Africa">
        <option value="Tunisia">Tunisia</option>
        <option value="Kenya">Kenya</option>
        <option value="South Africa">South Africa</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Egypt">Egypt</option>
        {/* Add more African countries as needed */}
      </optgroup>
      {/* Add more optgroup tags for other continents */}
    </select>
  </div>

  <div className="filter-group">
    <label htmlFor="city">City:</label>
    <input
      type="text"
      id="city"
      name="city"
      value={filters.city}
      onChange={handleChange}
      placeholder="Search by City"
    />
  </div>

  <div className="filter-group">
    <label htmlFor="language">Language:</label>
    <select
      id="language"
      name="language"
      value={filters.language}
      onChange={handleChange}
    >
      <option value="">Select Language</option>
      <option value="English">English</option>
      <option value="French">French</option>
      <option value="Spanish">Spanish</option>
      <option value="German">German</option>
      {/* Add more language options as needed */}
    </select>
  </div>

  <div className="filter-group">
    <label htmlFor="professionalTitle">Professional Title:</label>
    <select
      id="professionalTitle"
      name="professionalTitle"
      value={filters.professionalTitle}
      onChange={handleChange}
    >
      <option value="">Select Professional Title</option>
      <option value="IT Manager">IT Manager</option>
      <option value="Cloud Engineer">Cloud Engineer</option>
      <option value="Software Developer">Software Developer</option>
      <option value="Data Scientist">Data Scientist</option>
      <option value="Business Intelligence">Business Intelligence</option>
      <option value="Mobile Developer">Mobile Developer</option>
      <option value="Devops">Devops</option>
      <option value="Cyber Security">Cyber Security</option>
      {/* Add more professional titles as needed */}
    </select>
  </div>

  <button className="butt" onClick={() => handleSearch(filters)}>Search</button>
</div>


        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchh;
