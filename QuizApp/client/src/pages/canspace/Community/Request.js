import React, { useEffect, useState } from 'react';
import './Userslist.css';
import axios from 'axios';

import { useParams, useNavigate } from 'react-router-dom';
import Sidebarcan from '../Sidebar/Sidebarcan';
import { fetchUser } from '../../../pages/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
function Request() {
  const { canId } = useParams();
  const [requests, setRequests] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.data);
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/request/requests/pending/${canId}`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
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
    fetchRequests();
  }, [canId]);

  const handleViewProfile = (senderId) => {
    navigate(`/${canId}/ViewProfile/${senderId}`);
  };

  const handleDeleteRequest = async (senderId, recipientId) => {
    try {
      await axios.delete(`http://localhost:5000/api/request/${senderId}/${recipientId}`);
      fetchRequests(); // Refresh requests after deletion
      console.log('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleAcceptRequest = async (senderId, recipientId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/request/${senderId}/${recipientId}`, { status: 'accepted' });
      fetchRequests(); // Refresh requests after acceptance
      console.log('Request accepted successfully:', response.data);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleviewsugg = () => {
    navigate(`/${canId}/userlistt/`);
  };

  const handleViewrequests = () => {
    navigate(`/${canId}/requests/`);
  };

  const handleviewfriends = () => {
    navigate(`/${canId}/friendss/`);
  };

  const handleviewsearch = () => {
    navigate(`/${canId}/Searchh`);
  };

  return (
    <div className="rhDash">
      <Sidebarcan />
      <div className="body_co">
        <div className="co">
          <div className='buttons' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewrequests}>Requests</button>
            <button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleviewfriends}>Friends</button>
          </div>
          <div className="content-wrapper">
            <div className="tabble">
              <table className="tabble table-striped">
                <thead>
                  <tr>
                    <th>Sender Name</th>
                    <th>Sender Professional Title</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const lastJob = request.senderId.recentJobPosts.length > 0 ? request.senderId.recentJobPosts[request.senderId.recentJobPosts.length - 1] : null;

                    return (
                      <tr key={request._id}>
                        <td>{request.senderId.name}</td>
                        <td>{request.senderId.role}</td>
                        <td>{lastJob ? lastJob.company : 'N/A'}</td>
                        <td>
                          <button className='but' onClick={() => handleAcceptRequest(request.senderId._id, request.recipientId)}>Accept</button>
                          <button className='buttt' onClick={() => handleDeleteRequest( request.recipientId,request.senderId._id)}>Delete</button>
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

export default Request;
