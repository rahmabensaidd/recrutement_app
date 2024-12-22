import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import './assets/signup.css'; // Adjust path based on your CSS location
import imgsrc from '../Login/assets/Advertiser.png'; // Sample image import

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });
  const navigate = useNavigate(); // Créer une instance de navigate

  const handleClick = () => {
     // Naviguer vers /login
  };
  const { name, email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/register`, formData);
      
      console.log(response.data);
      navigate('/login');
      // Optionally, you can redirect or handle success as needed
    } catch (error) {
      console.error('There was an error registering the user!', error);
      alert('Failed to register user');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {/* Video Background */}
      <div className="video-background">
       
      </div>

      <motion.div className="signup-container">
        <div className="divv">
          <motion.div
            className="signup-frame"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, delay: 3}}
          >
            <form onSubmit={handleSubmit} className="p-4">
              <h2>Sign up here</h2>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <div className='inbloc'>
                <label>Role:</label>
                <select
                  className="form-control rounded-pill"
                  name="role"
                  value={role}
                  onChange={handleChange}
                >
                  <option value="candidate">Candidate</option>
                  <option value="hr">Human Resource</option>
                </select>
                <br></br>
                <button type="submit" className="btn btn-primary btn-block rounded-pill"   >
                Register
              </button>
              </div>
              </div>

            </form>
           
          </motion.div>

          {/* About Div */}
          <div className="about">
            <h3>About Recruitment App</h3>
            <p>
              Our recruitment app is designed to connect talented candidates with leading companies
              in various industries. We foster a vibrant community where professionals can explore
              career opportunities, participate in quizzes to enhance their skills, and engage with
              innovative companies looking to expand their teams.
            </p>
            <p className="mt-3" style={{ color: 'red' }}>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;
