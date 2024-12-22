import React, { useEffect, useState } from 'react';
import './friend.css';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchFriends, cancelRequest } from '../../../actions/FriendsActions';
import axios from 'axios';
import Sidebarcan from '../Sidebar/Sidebarcan';
function Friends() {
  const { canId } = useParams();
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const FriendsState = useSelector((state) => state.friends);
  const { friends } = FriendsState;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFriends(canId));
  }, [dispatch, canId]);

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
  const handleView11 = () => {
    navigate(`/${canId}/QuizTable/`);
  };
  const handleviewS =() => {
    navigate(`/${canId}/userlist/`);
  };

  const handleViewProfile = (canIdd) => {
    navigate(`/${canId}/ViewProfilee/${canIdd}`);
  };

  const handleCancelRequest = (recipientId) => {
    dispatch(cancelRequest(canId, recipientId))
      .then(() => {
        dispatch(fetchFriends(canId));
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
    navigate(`/${canId}/friendss/`);
  };
  const handleViewSearch =() =>{
     navigate(`/${canId}/Searchh`);
  };
  const handleViewrequests = ()=>{
    navigate (`/${canId}/requests/`)
  }

  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebarcan/>
      <div className="body_co">
        <div className="co">
        <div className='buttons' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>

<button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewrequests}>requests</button>
<button className="butt" style={{ marginRight: '0.5rem' }} onClick={handleViewfriends}>Friends</button>


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
