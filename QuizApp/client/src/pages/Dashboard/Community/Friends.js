import React, { useEffect, useState } from 'react';
import './friend.css';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,
} from '@material-ui/icons';
import Item from '../components/Item';
import { fetchFriends, cancelRequest } from '../../../actions/FriendsActions';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar';
function Friends() {
  const { rhId } = useParams();
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const FriendsState = useSelector((state) => state.friends);
  const { friends } = FriendsState;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFriends(rhId));
  }, [dispatch, rhId]);

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
  const handleView11 = () => {
    navigate(`/${rhId}/QuizTable/`);
  };
  const handleviewS =() => {
    navigate(`/${rhId}/userlist/`);
  };

  const handleViewProfile = (canId) => {
    navigate(`/${rhId}/ViewProfile/${canId}`);
  };

  const handleCancelRequest = (recipientId) => {
    dispatch(cancelRequest( recipientId,rhId))
      .then(() => {
        dispatch(fetchFriends(rhId));
      })
      .catch((error) => {
        console.error('Error canceling request:', error);
      });
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const sideContainerVariants = {
    true: { width: '15rem' },
    false: { width: '6rem', transition: { delay: 0.6 } },
  };

  const sidebarVariants = {
    true: {},
    false: { width: '5rem', transition: { delay: 0.4 } },
  };

  const profileVariants = {
    true: { alignSelf: 'center', width: '4rem' },
    false: { alignSelf: 'flex-start', marginTop: '2rem', width: '3rem' },
  };
  const handleViewfriends = () => {
    navigate(`/${rhId}/friends/`);
  };
  const handleViewSearch =() =>{
    navigate(`/${rhId}/Search`);
  };
  const handleViewSugg =() =>{
    navigate(`/${rhId}/userlist/`);
  };
  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar/>
      <div className="body_co">
      <div className="co">
        <div className='buttons' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>


<button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewSugg}>Suggestions</button>
<button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewfriends}>Friends</button>
<button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewSearch}>Search</button>

</div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>job title</th>
                <th>company</th>
                <th>email</th>
                <th>status</th>
                <th>actions</th>
              
              </tr>
            </thead>
            <tbody>
            {friends.map((friend) =>{ 
  const lastJob = friend.recentJobPosts.length > 0 ? friend.recentJobPosts[friend.recentJobPosts.length - 1] : null;
  return(
    <tr key={friend._id}>
      <td>{friend.name}</td>
      <td>{friend.professionalTitle}</td>
      <td>{lastJob ? lastJob.company : '-'}</td>
      <td>{friend.email}</td>
      <td>friend</td> 
      <td>
        <button className="butv" onClick={() => handleViewProfile(friend._id)}>
          View Profile
        </button>
        <button className="butd" onClick={() => handleCancelRequest(friend._id)}>
          delete friend
        </button>
      </td>
    </tr>
  );
})}
            </tbody>
          </table>


        </div>
      </div>
    </div>
  );
}

export default Friends;
