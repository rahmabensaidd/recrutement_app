import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './assets/loginn.css'; // Custom CSS
import videoSrc from '../../pages/Login/assets/Girl got a perfect CV..mp4';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
   
      console.log(response.data);

      const { role, id } = response.data;
      if (role === 'hr') {
        navigate(`/rh-dashboard/${id}`);
      } else if (role === 'candidate') {
        navigate(`/candidate-dashboard/${id}`);
      } else {
        console.error('Unknown role:', role);
        alert('Invalid role encountered.');
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', id);
    } catch (error) {
      console.error('There was an error logging in!', error);
      alert('Failed to login');
    }
  };

  return (
    <div className="login-container">
      <div className="divv">
        <motion.div
          className="login-frame"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <form onSubmit={handleSubmit} className="p-4">
            <div className="form-group">
              <h2>Oh It's you!</h2> 
              <p>sign in to access your dashboard.</p>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control rounded-pill" // Rounded corners
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control rounded-pill" // Rounded corners
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
            <br />
            <button type="submit" className="btn btn-primary btn-block rounded-pill"> {/* Rounded corners */}
              Login
            </button>
          </form>
          <p className="mt-3">Don't have an account? <Link to="/signup">Register here</Link></p>
        </motion.div>
        <motion.div
          className="video-frame"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <video autoPlay loop muted>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </motion.div>
      
      </div>
    </div>
  );
};

export default Login;
