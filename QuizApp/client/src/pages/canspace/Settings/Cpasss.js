import React, { useState ,useEffect } from 'react';

import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Button, Form, Card } from 'react-bootstrap';

import Sidebarcan from '../Sidebar/Sidebarcan';
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
function Cpasss() {

  const { canId } = useParams(); 
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
 
  const [success, setSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/auth/changepwd/${canId}`, {
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
    <div className="rhDash ">
      <div className="row">
       <Sidebarcan/>

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

export default Cpasss;
