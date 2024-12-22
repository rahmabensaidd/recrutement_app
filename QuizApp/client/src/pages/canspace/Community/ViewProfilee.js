import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import './ViewProfile.css';

import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser ,fetchUserr } from '../../slices/userSlice';

import axios from 'axios';

import Sidebarcan from '../Sidebar/Sidebarcan';
function ViewProfilee() {
  const { canIdd ,canId} = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = React.useState(true);
 
  useEffect(() => {
    if (canIdd) {
      dispatch(fetchUser(canIdd));
    }
  }, [canIdd, dispatch]);
  useEffect(() => {
    if (canId) {
      dispatch(fetchUserr(canId));
    }
  }, [canIdd, dispatch]);

 

  if (error) {
    return <div>Error: {error}</div>;
  }
  const getProficiencyWidth = (proficiency) => {
    switch (proficiency) {
      case 'beginner':
        return '25%';
      case 'intermediate':
        return '50%';
      case 'advanced':
        return '75%';
      case 'native':
        return '100%';
      default:
        return '0%';
    }
  };




  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
     <Sidebarcan/>
        <div className='bodyy_container'>
  
        <div className="profile-container">
        <div className="proo"  style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '10px' }}>
            <div className="profile-pic">
            {user.personalPhoto ? (
                <img
                  src={`http://localhost:5000/public/uploads/${user.personalPhoto}`}
                  alt="Profile"
                />
              ) : (
                <p>No Photo Available</p>
              )}
             </div>
             <div > 

              
                      </div>
          <div className="header">
            <div className="name-section">
              <p>{user.name}<br />{user.professionalTitle}<br />{user.placeOfResidence.city} {user.placeOfResidence.country}<br />{user.role}</p>
            </div>
            <div className="contact-section">
              <p>{user.mobileNumber}<br />{user.email}</p>
            </div>
          </div>
          </div>
          <div className="des">
        
            <div className="description">  <p >Description</p>{user.description}</div>
          <div className="languages-skills">

           <div className='lan'><p>Languages:</p>
            {user.languages.map((language, index) => (
              <div key={index} className="language-section">
                <span className="language-name">{language.name}</span>
                <div className="proficiency-bar">
                  <div
                    className="proficiency-fill"
                    style={{ width: getProficiencyWidth(language.proficiency) }}
                  ></div>
                </div>
              </div>
            ))}</div>
            
        
          </div>
          </div>
         

  
          
          <div className="h" >
 

         <div className="training">
         <div className='lan'>
  <p>Training:</p>
  {user.training.map((training, index) => (
    <div key={index} className="lo">
      <div className="training-info"style={{ display: 'inline-flex', alignItems: 'center' }}>
        <p style={{ color: 'white' }}>Course Name:</p>
        <p>{training.courseName}</p>
      </div> <br/>

      <div className="training-info" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <p style={{ color: 'white' }}>Institution:</p>
        <p>{training.institution} ({training.beginningYear} - {training.endingYear})</p>
      </div><br/>
      <div className="training-info"style={{ display: 'inline-flex', alignItems: 'center' }}>
        <p style={{ color: 'white' }}>Certificate URL:</p>
        <p><a href={training.certificateURL} target="_blank" rel="noopener noreferrer">{training.certificateURL}</a></p>
      </div><br/>
    </div>
  ))}
</div>


      <div className="lan">
            <h3>Recent Job Posts</h3>
            <div className='jib-section'> {user.recentJobPosts.map((job, index) => (
             <div key={index} className="lo">
             <div className="job-info" style={{ display: 'inline-flex', alignItems: 'center' }}>
               <p style={{ color: 'white' }}>Title:</p>
               <p>{job.title}</p>
             </div><br/>
             <div className="job-info" style={{ display: 'inline-flex', alignItems: 'center' }}>
               <p style={{ color: 'white' }}>Company:</p>
               <p>{job.company}</p>
             </div><br/>
             <div className="job-info" style={{ display: 'inline-flex', alignItems: 'center' }}>
               <p style={{ color: 'white' }}>Duration:</p>
               <p>({job.startDate} - {job.endDate})</p>
             </div><br/>
             <div className="job-info" style={{ display: 'inline-flex', alignItems: 'center' }}>
               <p style={{ color: 'white' }}>Description:</p>
               <p>{job.description}</p>
             </div>
           </div>
            ))}</div>
           
          </div>
           </div>
          
        
        <div className="links">
          
          <div style={{ display: 'flex', marginRight: '10px', flexDirection: 'row' , gap: '40px' }}className=''><p className='lo'>linkedin: {user.linkedinProfile} </p><p className='lo'>github: {user.githubProfile}</p></div>
          <div style={{ display: 'flex', marginRight: '10px', flexDirection: 'row' , gap: '40px' }}> <p className='lo'> cvurl: {user.cvFile} </p><p className='lo'>website: {user.website}</p></div>

          </div>
         </div>
          </div>
      </div>        
      </div>
  
  );
}

export default ViewProfilee;
