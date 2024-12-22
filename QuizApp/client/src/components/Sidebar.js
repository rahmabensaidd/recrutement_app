import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from 'react-router-dom';
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
  ExitToAppRounded,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import Item from "../pages/Dashboard/components/Item";
import { fetchUser } from '../pages/slices/userSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const { rhId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [open, setOpen] = useState(true);
 const [rhUser, setRhUser] = useState(null);
  useEffect(() => {
    if (rhId) {
      dispatch(fetchUser(rhId)).then(response => {
        setRhUser(response.payload); // Assuming your fetchUser action returns the payload
      });
    }
  }, [rhId, dispatch]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      data-Open={open}
      variants={{
        true: { width: "15rem" },
        false: { width: "6rem", transition: { delay: 0.6 } },
      }}
      initial={{ width: open ? "15rem" : "6rem" }}
      animate={{ width: open ? "15rem" : "6rem" }}
      className="sidebar_container col-auto"
    >
      <motion.div
        className="sidebar"
        initial={{ width: open ? "15rem" : "6rem" }}
        animate={{ width: open ? "15rem" : "6rem" }}
      >
        <motion.div
          whileHover={{
            scale: 1.2,
            rotate: 180,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(3.5px)",
            WebkitBackdropFilter: "blur(3.5px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
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
          onClick={() => handleNavigate(`/${rhId}/ViewmyProfile/`)}
          className="profile"
        >
          {user.personalPhoto ? (
            <img
              src={`http://localhost:5000/public/uploads/${user.personalPhoto}`}
              alt="Profile"
            />
          ) : (
            <p>No Photo Available</p>
          )}
        </motion.div>
        <div className="groups">
          
         
            <motion.h3
              animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
            >
         
            </motion.h3>
            <Item icon={<BarChartRounded />} name="Quizzes" onClick={() => handleNavigate(`/${rhId}/QuizTable/`)} />
            <Item icon={<AssignmentTurnedInRounded />} name="Assignments" onClick={() => handleNavigate(`/${rhId}/TabAssign`)} />
            <Item icon={<AssignmentTurnedInRounded />} name="Results" onClick={() => handleNavigate(`/${rhId}/Results`)} />
      
          
            <Item icon={<BarChartRounded />} name="Posts" onClick={() => handleNavigate(`/${rhId}/Posts/`)} />
           
          <div className="group">
            <motion.h3
              animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
            >
            
            </motion.h3>
            <Item icon={<SettingsRemoteRounded />} name="Community" onClick={() => handleNavigate(`/${rhId}/userlist/`)} />
            <Item icon={<ColorLensRounded />} name="Settings" onClick={() => handleNavigate(`/Setting/${rhId}`)} />
            <Item  icon={<  ExitToAppRounded/>} name="Disconnect " onClick={() => handleNavigate(`/login`)} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;
