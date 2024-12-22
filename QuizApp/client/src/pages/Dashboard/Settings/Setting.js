import React, { useState ,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useParams ,useNavigate} from 'react-router-dom';
import { fetchUser } from '../../../pages/slices/userSlice';
import axios from 'axios';
import"./Setting.css";
import { useDispatch, useSelector } from 'react-redux';
import {
    AccountCircleRounded,
    AssignmentTurnedInRounded,
    BarChartRounded,
    ColorLensRounded,
    DashboardRounded,
    SettingsRemoteRounded,
    TocRounded,
    DeleteForeverRounded,
    PlaylistAddRounded,
    VisibilityRounded,
  } from "@material-ui/icons";
import { Button, Form } from 'react-bootstrap';
import Item from "../../../pages/Dashboard/components/Item";
import Sidebar from '../../../components/Sidebar';
function Setting() {
  const user = useSelector(state => state.user.data);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { rhId } = useParams(); 

  
  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    newPassword: '',
    confirmNewPassword: '',
    theme: 'light',
    visibility: 'public',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };
  const [open, setOpen] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
   const userId=rhId;


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
 
  }, rhId);



  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submit logic (e.g., update user settings via API)
    console.log('Updated settings:', userSettings);
  };

  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <div className="row">
   <Sidebar/>

        {/* Main Content */}
        <div className="col ">
       
       
            <h2>Settings</h2>
            <Form onSubmit={handleSubmit}>
              {/* Edit Profile Section */} <br></br>
              <div className="settings-section">
  <h3>Edit Profile</h3>
  <Link to={`/${userId}/UserProfile/`} className="settings-link">
                  Edit Profile
                </Link>
</div>
              <br></br>
              {/* Change Password Section */}

              <div className="settings-section">
                <h3>Change Password</h3>
                <Link to={`/changepwd/${userId}`}className="settings-link">Change Password</Link>
              </div>
              <br></br>
              {/* Theme & Customization Section */}
              
              <br></br>

              {/* Support & Help Section */}
              <div className="settings-section">
                <h3>Support & Help</h3>
                <p>Contact our support team for assistance.</p>
              </div>
            </Form>
          </div>
        </div>
      </div>
 
  );
}

export default Setting;
