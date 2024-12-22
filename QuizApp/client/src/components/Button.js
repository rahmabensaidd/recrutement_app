import React from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import axios from "axios";

const Buttonn = ({ onPhotoUploaded, userId }) => {
  const handleChange = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("photo", e.target.files[0]);

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${userId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
      if (onPhotoUploaded) onPhotoUploaded();  // Call the callback function to refresh user data
    } catch (err) {
      console.error("Error uploading photo:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <label className="button" htmlFor="file_picker">
      <AiFillPlusCircle />
      <input
        type="file"
        id="file_picker"
        onChange={handleChange}
        style={{ display: 'none' }} // Ensure the file input is hidden
      />
    </label>
  );
};

export default Buttonn;
