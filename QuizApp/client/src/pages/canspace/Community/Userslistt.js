import React, { useEffect, useState } from 'react';
import './Userslist.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSuggestions, getRequestStatus, sendRequest, cancelRequest } from '../../../actions/suggActions';
import Sidebarcan from '../Sidebar/Sidebarcan';

function Userslistt() {
  const { canId } = useParams();
  const [open, setOpen] = useState(true);
  const [requestStatuses, setRequestStatuses] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const suggestionsState = useSelector((state) => state.suggestions);
  const { suggestions } = suggestionsState;

  useEffect(() => {
    dispatch(fetchSuggestions(canId));
  }, [dispatch, canId]);

  const navigate = useNavigate();

  const handleViewfriends = () => {
    navigate(`/${canId}/friendss/`);
  };

  const handleViewSearch = () => {
    navigate(`/${canId}/Searchh`);
  };

  const handleViewProfile = (canIdd) => {
    navigate(`/${canId}/ViewProfile/${canIdd}`);
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

  const handleCancelRequest = (recipientId) => {
    dispatch(cancelRequest(canId, recipientId))
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
      <Sidebarcan />
      <div className="body_container">
        <div className="conn">
          <div className='buttons' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>

            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewrequests}>Requests</button>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewfriends}>Friends</button>

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
                            <button className="but" onClick={() => handleViewProfile(candidate._id)}>
                              View Profile
                            </button>
                            <button
                              className="buttt"
                              onClick={() => {
                                if (requestStatus === 'pending') {
                                  handleCancelRequest(candidate._id);
                                } else if (requestStatus === 'canceled' || requestStatus === 'none') {
                                  handleSendRequest(candidate._id);
                                }
                              }}
                            >
                              {requestStatus === 'pending' ? 'Cancel' : 'Send request'}
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
    </div>
  );
}

export default Userslistt;
