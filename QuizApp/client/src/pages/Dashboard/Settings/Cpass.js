import React, { useState ,useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,
  VisibilityRounded,
  VisibilityOffRounded,
} from "@material-ui/icons";
import { Button, Form, Card } from 'react-bootstrap';
import Item from "../../../pages/Dashboard/components/Item";
import Sidebar from '../../../components/Sidebar';

function Cpass() {
  const [open, setOpen] = useState(true);
  const { userId } = useParams(); 
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
        setDarkMode(response.data.darkMode); // Adjust based on your API response
      } catch (error) {
        console.error('Error fetching dark mode state:', error);
      }
    };

    fetchDarkMode();

  }, userId);
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/auth/changepwd/${userId}`, {
        currentPassword: oldPassword,
        newPassword: newPassword,
      });
      setSuccess(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response.data.message);
      setSuccess('');
    }
  };

  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
      <div className="row">
       <Sidebar/>

        <div className="col d-flex justify-content-center align-items-center">
          <Card className="settings-card" style={{ width: '50rem', padding: '2rem' }}>
            <h3 className="text-center">Change Password</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formOldPassword">
                <Form.Label>Old Password</Form.Label>
                <div className="input-group mb-3">
                  <Form.Control
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="Old Password"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                  </Button>
                </div>
              </Form.Group>
              <Form.Group controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <div className="input-group mb-3">
                  <Form.Control
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New Password"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                  </Button>
                </div>
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm new password</Form.Label>
                <div className="input-group mb-3">
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                  </Button>
                </div>
              </Form.Group>
              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
              {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
              <Button type="submit" className="btn-primary w-100">Change Password</Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Cpass;
