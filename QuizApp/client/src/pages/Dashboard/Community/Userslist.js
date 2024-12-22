import React, { useEffect, useState } from 'react';
import './Userslist.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSuggestions, getRequestStatus, sendRequest, cancelRequest } from '../../../actions/suggActions';
import Sidebar from '../../../components/Sidebar';
import { fetchUser } from '../../../pages/slices/userSlice';
function Userslist() {
  const { rhId } = useParams();
  const [open, setOpen] = useState(true);
  const [requestStatuses, setRequestStatuses] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const suggestionsState = useSelector((state) => state.suggestions);
  const { suggestions } = suggestionsState;
  const user = useSelector(state => state.user.data);
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
    dispatch(fetchSuggestions(rhId));
  }, [dispatch, rhId]);



  const handleViewfriends = () => {
    navigate(`/${rhId}/friends/`);
  };

  const handleViewSearch = () => {
    navigate(`/${rhId}/Search`);
  };

  const handleViewProfile = (canIdd) => {
    navigate(`/${rhId}/ViewProfile/${canIdd}`);
  };


  const handleSendRequest = (recipientId) => {
    dispatch(sendRequest(rhId, recipientId))
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

  const handleCancelRequest = (recipientId) => {
    dispatch(cancelRequest(rhId, recipientId))
      .then(() => {
        setRequestStatuses((prevState) => ({
          ...prevState,
          [recipientId]: 'canceled',
        }));
      })
      .catch((error) => {
        console.error('Error canceling request:', error);
      });
  };

  return (
    <div className="rhDash">
      <Sidebar />
      <div className="body_co">
        <div className="co">
          <div className='buttons' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button className="butt" style={{ marginRight: '0.5rem' }}>Suggestions</button>

            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewfriends}>Friends</button>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewSearch}>Search</button>
          </div>
 
     
            <div className="tabble">
              <table className="tabble tabble-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Professional Title</th>
                    <th>Last Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((candidate) => {
                    const lastJob = candidate.recentJobPosts.length > 0 ? candidate.recentJobPosts[candidate.recentJobPosts.length - 1] : null;
                    const requestStatus = requestStatuses[candidate._id] || 'none';  // Default to 'none'

                    return (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.professionalTitle}</td>
                        <td>{lastJob ? lastJob.company : 'N/A'}</td>
                        <td>
                          <div className='buttons'>
                            <button className="but" style={{ width: '150px' }} onClick={() => handleViewProfile(candidate._id)}>
                              Profile
                            </button>
                            <button
                              className="buttt" style={{ width: '250px' }}
                              onClick={() => {
                                if (requestStatus === 'pending') {
                                  handleCancelRequest(candidate._id);
                                } else if (requestStatus === 'canceled' || requestStatus === 'none') {
                                  handleSendRequest(candidate._id);
                                }
                              }}
                            >
                              {requestStatus === 'pending' ? 'Cancel' : 'Send '}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
         
            </div>
         
        </div>
      </div>
    </div>
  );
}

export default Userslist;
