import React, { useState ,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import"./Setting.css";


import { Button, Form } from 'react-bootstrap';
import Sidebarcan from '../Sidebar/Sidebarcan';

function Settingg() {
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
  const { canId } = useParams(); 




  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submit logic (e.g., update user settings via API)
    console.log('Updated settings:', userSettings);
  };

  return (
    <div className="rhDash">
      <div className="row">
   <Sidebarcan/>

        {/* Main Content */}
        <div className="col">
          <div>
          <br></br>
            <h2>Settings</h2>
            <Form onSubmit={handleSubmit}>
              {/* Edit Profile Section */} <br></br>
              <div className="settings-section">
  <h3>Edit Profile</h3>
  <Link to={`/${canId}/UserProfilee/`} className="settings-link">
                  Edit Profile
                </Link>
</div>
              <br></br>
              {/* Change Password Section */}

              <div className="settings-section">
                <h3>Change Password</h3>
                <Link to={`/changepwdd/${canId}`}className="settings-link">Change Password</Link>
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
    </div>
  );
}

export default Settingg;
