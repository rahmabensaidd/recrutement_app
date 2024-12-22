import React, { useEffect ,useState} from 'react';
import "./rhDashboard.css";
import { motion } from "framer-motion";
import {   useNavigate,useParams } from 'react-router-dom';
import {
  AccountCircleRounded,
  AssignmentTurnedInRounded,
  AttachMoneyRounded,
  BarChartRounded,
  ColorLensRounded,
  DashboardRounded,
  SettingsRemoteRounded,
  TocRounded,


  
} from "@material-ui/icons";
import axios from 'axios';
import Item from "../components/Item";
import Sidebar from '../../../components/Sidebar';


function RhDashboard() {
  const [open, setOpen] = useState(true);
  const { rhId } = useParams(); 
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const handleView1 = (rhIdd) => {
    navigate(`/${rhId}/QuizTable/`); // Utilisation de `rhId` pour le paramètre du responsable RH
  };
  const handleView2 = (rhIdd) => {
    navigate(`/createQuiz/${rhId}`); // Utilisation de `rhId` pour le paramètre du responsable RH
  };
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
  // for collpsing sidebar
  const handleToggle = () => {
    setOpen(!open);
  };

  const sideContainerVariants = {
    true: {
      width: "15rem",
    },
    false: {
      transition: {
        width: "6rem",
        delay: 0.6,
        
      },
    },
  };

  const sidebarVariants = {
    true: {},
    false: {
      width: "5rem",
      transition: {
        delay: 0.4,
      },
    },
  };

  const profileVariants = {
    true: {
      alignSelf: "center",
      width: "4rem",
    },
    false: {
      alignSelf: "flex-start",
      marginTop: "2rem",
      width: "3rem",
    },
  };
  return (
    <div className={`rhDash ${darkMode ? 'dark-mode' : ''}`}>
     <Sidebar/>

      <div className="body_container">
        {/* <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr />i am body
        <hr /> */}
      
      </div>
    </div>
  );
}

export default RhDashboard;