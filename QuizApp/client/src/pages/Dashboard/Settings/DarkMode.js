import React, { useEffect, useState } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import { useParams } from 'react-router-dom';

import axios from 'axios';

const DarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { rhId } = useParams(); 

    const userId=rhId;
    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
                const data = await response.json();
                setIsDarkMode(data.darkMode);
                if (data.darkMode) {
                    document.body.classList.add("dark");
                }
            } catch (error) {
                console.error("Error fetching user settings:", error);
            }
        };

        fetchUserSettings();
    }, [userId]);

    const handleToggle = async () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.body.classList.toggle("dark", newDarkMode);
        
        try {
            await axios.put(`http://localhost:5000/api/auth/darkmode/${userId}`, { darkMode: newDarkMode });
        } catch (error) {
            console.error("Error updating dark mode:", error);
        }
    };

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                checked={isDarkMode}
                onChange={handleToggle}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
