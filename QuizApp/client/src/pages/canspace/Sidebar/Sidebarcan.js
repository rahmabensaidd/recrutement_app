import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebarcan.css";
import Item from "../../Dashboard/components/Item";
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
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
  ExitToAppRounded, 
  PlaylistAddRounded,
  VisibilityRounded,
} from "@material-ui/icons";
import { Modal, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";


import {fetchUserr} from '../../../pages/slices/userSlice'
   // Ajoutez dispatch dans le tableau de dépendances

function Sidebarcan() {
  const { canId } = useParams(); 
  const [open, setOpen] = useState(true);

  const userr = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (canId) {
      dispatch(fetchUserr(canId));
    }
  }, [canId, dispatch]);
  
  const handleNavigate = (path) => {
    navigate(path);
  };



  const handleToggle = () => {
    setOpen(!open);
  };


  

  return (
   
      
        <motion.div
          data-Open={open}
          variants={{
            true: { width: "15rem" },
            false: { transition: { width: "6rem", delay: 0.6 } },
          }}
          initial={`${open}`}
          animate={`${open}`}
          className="sidebar_container col-auto"
        >
          <motion.div
            className="sidebar"
            initial={`${open}`}
            animate={`${open}`}
            variants={{
              true: {},
              false: { width: "5rem", transition: { delay: 0.4 } },
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 180,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(3.5px)",
                WebkitBackdropFilter: "blur(3.5px)",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                transition: { delay: 0.2, duration: 0.4 },
              }}
              onClick={handleToggle}
              className="lines_icon"
            >
              <TocRounded />
            </motion.div>
            <motion.div
          whileHover={{
            scale: 1.2,
            rotate: 180,
          
            cursor: "pointer",
            borderRadius:"50%",
          }}
          onClick={() => handleNavigate(`/${canId}/ViewmyProfilee/`)}
          className="profile"
        >
          {userr.personalPhoto ? (
            <img
              src={`http://localhost:5000/public/uploads/${userr.personalPhoto}`}
              alt="Profile"
            />
          ) : (
            <p>No Photo Available</p>
          )}
        </motion.div>
            <div className="groups">
          
              <div className="group">
                
                <motion.h3
                  animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }
                     }
                     onClick={() => navigate(`/${canId}/quiz-table`)}
                >
                
                </motion.h3>
                <Item
                  icon={<BarChartRounded />}
                  name="Posts"
                  onClick={() => navigate(`/${canId}/Jobposts/`)}
                />
                <Item
                  icon={<BarChartRounded />}
                  name="Assignments"
                  onClick={() => navigate(`/${canId}/Assignments`)}
                />
                  <Item
                  icon={<AssignmentTurnedInRounded />}
                  name="Results" 
                  onClick={() => navigate(`/${canId}/RsultCan/`)}
                />
                <Item icon={<AccountCircleRounded />} name="Train yourself"
                 onClick={() => navigate(`/${canId}/Trainyourself/`)} />
              </div>
              <div className="group">
                <motion.h3
                  animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
                >
               
                </motion.h3>
                <Item
                  icon={<SettingsRemoteRounded />}
                  name="Community"
                  onClick={() => navigate(`/${canId}/requests/`)}
                />

                <Item icon={<ColorLensRounded />} name="Settings"  onClick={() => navigate(`/Settingg/${canId}`)} />
                <Item icon={<  ExitToAppRounded />} name="Disconnect"  onClick={() => navigate(`/login`)} />
           
              </div>
            </div>
          </motion.div>
        </motion.div>


    
    
  );
}

export default Sidebarcan;
