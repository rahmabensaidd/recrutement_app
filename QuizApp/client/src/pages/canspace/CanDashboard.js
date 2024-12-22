import React, { useEffect, useState } from 'react';
import './CanDashboard.css';


import { useParams, useNavigate } from 'react-router-dom';


import axios from 'axios';
import Sidebarcan from './Sidebar/Sidebarcan';
function CanDashboard() {
  const { canId } = useParams();

  const navigate = useNavigate();



  
  return (
    <div className='canDash' >
      <Sidebarcan/>
      <div className="body_container">
        <div className="conn">
      
      </div>
    </div>
    </div>
  );
};
export default CanDashboard;
