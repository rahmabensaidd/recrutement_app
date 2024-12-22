import "bootstrap/dist/css/bootstrap.min.css";
import "./EditProfile.css";
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from './Button';
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
} from "@material-ui/icons";
import { Button as BootstrapButton, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { fetchUser, updateUser, setUserField } from '../pages/slices/userSlice';
import Sidebar from '../../src/components/Sidebar';

function EditProfile() {
  const { rhId } = useParams();
  const [open, setOpen] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const status = useSelector(state => state.user.status);
  const error = useSelector(state => state.user.error);
  const [localUser, setLocalUser] = useState(user);
  const [photos, setPhotos] = useState([]);
  const [updateUI, setUpdateUI] = useState("");
  const navigate = useNavigate();
  const [training, setTraining] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  useEffect(() => {
    if (rhId) {
      dispatch(fetchUser(rhId));
    }
  }, [rhId, dispatch]);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handlePhotoUploaded = () => {
    dispatch(fetchUser(rhId));
  };

  const calculateCompletionPercentage = (user) => {
    const totalFields = 14;
    let filledFields = 0;

    if (user.name) filledFields++;
    if (user.email) filledFields++;
    if (user.role) filledFields++;
    if (user.personalPhoto) filledFields++;
    if (user.placeOfResidence?.city || user.placeOfResidence?.country) filledFields++;
    if (user.mobileNumber) filledFields++;
    if (user.professionalTitle) filledFields++;
    if (user.description) filledFields++;
    if (user.linkedinProfile) filledFields++;
    if (user.githubProfile) filledFields++;
    if (user.website) filledFields++;
    if (user.cvFile) filledFields++;
    if (user.languages.length > 0) filledFields++;
    
    if (user.recentJobPosts.length > 0) filledFields++;

    return (filledFields / totalFields) * 100;
  };

  const deletePhoto = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/${rhId}/photo`);
      dispatch(fetchUser(rhId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo', error);
    }
  };

  const percentageFilled = calculateCompletionPercentage(localUser);

  const getProgressBarVariant = (percentage) => {
    if (percentage <= 50) return 'danger'; // Red for 0-50%
    if (percentage <= 80) return 'warning'; // Orange for 51-80%
    return 'success'; // Green for 81-100%
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const languagesValid = localUser.languages.every(language => language.name !== '' && language.proficiency !== '');
    const trainingValid = localUser.training.every(training => training.courseName !== '' && training.institution !== '' && training.beginningYear !== '' && training.endingYear !== '' && training.certificateURL !== '');
    const jobPostsValid = localUser.recentJobPosts.every(job => job.title !== '' && job.company !== '' && job.startDate !== '' && job.endDate !== '' && job.description !== '');
    const softSkillsValid = localUser.softSkills.every(skill => skill !== '');
    const technologiesValid = localUser.technologies.every(tech => tech !== '');

    if (!languagesValid || !trainingValid || !jobPostsValid || !softSkillsValid || !technologiesValid) {
      setErrorMessage('Please fill out all required fields.');
      setShowError(true);
      return;
    }

    try {
      await dispatch(updateUser({ rhId, userData: localUser })).unwrap();
    } catch (err) {
      setErrorMessage(err.message || 'Error updating user');
      setShowError(true);
    }
  };

  const handleAddLanguage = () => {
    setLocalUser(prevUser => ({
      ...prevUser,
      languages: [...prevUser.languages, { name: '', proficiency: 'beginner' }]
    }));
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = localUser.languages.map((language, i) => {
      if (i === index) {
        return { ...language, [field]: value };
      }
      return language;
    });
    setLocalUser(prevUser => ({ ...prevUser, languages: updatedLanguages }));
  };

  const handleCloseError = () => setShowError(false);

  const handleAddJobPost = () => {
    setLocalUser(prevUser => ({
      ...prevUser,
      recentJobPosts: [...prevUser.recentJobPosts, { title: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const handleJobPostChange = (index, field, value) => {
    const updatedJobPosts = localUser.recentJobPosts.map((job, i) => {
      if (i === index) {
        return { ...job, [field]: value };
      }
      return job;
    });
    setLocalUser(prevUser => ({ ...prevUser, recentJobPosts: updatedJobPosts }));
  };

  const handleResidenceChange = (field, value) => {
    setLocalUser(prevUser => ({
      ...prevUser,
      placeOfResidence: {
        ...prevUser.placeOfResidence,
        [field]: value
      }
    }));
  };

  const handleAddTraining = () => {
    setLocalUser(prevUser => ({
      ...prevUser,
      training: [...prevUser.training, { courseName: '', institution: '', beginningYear: '', endingYear: '', certificateURL: '' }]
    }));
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = localUser.languages.filter((_, i) => i !== index);
    setLocalUser(prevUser => ({ ...prevUser, languages: updatedLanguages }));
  };

  const handleRemoveJobPost = (index) => {
    const updatedJobPosts = localUser.recentJobPosts.filter((_, i) => i !== index);
    setLocalUser(prevUser => ({ ...prevUser, recentJobPosts: updatedJobPosts }));
  };

  const handleRemoveTraining = (index) => {
    const updatedTraining = localUser.training.filter((_, i) => i !== index);
    setLocalUser(prevUser => ({ ...prevUser, training: updatedTraining }));
  };

  const handleTrainingChange = (index, field, value) => {
    const updatedTraining = localUser.training.map((training, i) => {
      if (i === index) {
        return { ...training, [field]: value };
      }
      return training;
    });
    setLocalUser(prevUser => ({ ...prevUser, training: updatedTraining }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="rhDash">
      <div className="row">
        <Sidebar />
        <div className="col-md-9">
          <div className="scrollable-content">
            <h2 className="page-title">User Profile</h2>

            <div className="profile-section row mb-4">
              <div className="col-md-4">
                <div className="profile-pic-wrapper">
                  <div className="profile-pic">
                    {user.personalPhoto ? (
                      <img
                        src={`http://localhost:5000/public/uploads/${user.personalPhoto}`}
                        alt="Profile"
                        className="profile-img"
                      />
                    ) : (
                      <div className="no-photo">No Photo Available</div>
                    )}
                    <Button onPhotoUploaded={handlePhotoUploaded} userId={user._id} />
                  </div>
                  <BootstrapButton className="btn btn-danger btn-sm delete-photo mt-2" onClick={deletePhoto}>
                    Delete Photo <DeleteForeverRounded fontSize="small" />
                  </BootstrapButton>
                </div>
              </div>
              <div className="col-md-8">
                <div className="completion-section">
                  <h3>Profile Completion</h3>
                  <ProgressBar
                  now={percentageFilled}
                  variant={getProgressBarVariant(percentageFilled)}
                  label={`${percentageFilled.toFixed(0)}%`}
                  className="mb-4"
                />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Name:</label>
                  <input type="text" name="name" value={localUser.name} onChange={handleChange} required className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Email:</label>
                  <input type="email" name="email" value={localUser.email} onChange={handleChange} required className="form-control" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Mobile Number:</label>
                  <input type="tel" name="mobileNumber" value={localUser.mobileNumber} onChange={handleChange} required className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Role:</label>
                  <input type="text" name="role" value={localUser.role} onChange={handleChange} required className="form-control" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Professional Title:</label>
                  <input type="text" name="professionalTitle" value={localUser.professionalTitle} onChange={handleChange} required className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Description:</label>
                  <textarea name="description" value={localUser.description} onChange={handleChange} required className="form-control"></textarea>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>LinkedIn Profile:</label>
                  <input type="url" name="linkedinProfile" value={localUser.linkedinProfile} onChange={handleChange} required className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>GitHub Profile:</label>
                  <input type="url" name="githubProfile" value={localUser.githubProfile} onChange={handleChange} required className="form-control" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Website:</label>
                  <input type="url" name="website" value={localUser.website} onChange={handleChange} required className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Place of Residence:</label>
                  <div className="row">
                    <div className="col-md-6">
                      <input type="text" name="city" placeholder="City" value={localUser.placeOfResidence.city} onChange={(e) => handleResidenceChange('city', e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <input type="text" name="country" placeholder="Country" value={localUser.placeOfResidence.country} onChange={(e) => handleResidenceChange('country', e.target.value)} className="form-control" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label>CV File:</label>
                <input type="file" name="cvFile" onChange={(e) => setLocalUser({ ...localUser, cvFile: e.target.files[0] })} className="form-control" />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Languages:</label>
                  {localUser.languages.map((language, index) => (
                    <div key={index} className="row mb-2">
                      <div className="col-md-6">
                        <input type="text" name="name" placeholder="Language" value={language.name} onChange={(e) => handleLanguageChange(index, 'name', e.target.value)} className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <Select
                          name="proficiency"
                          value={{ value: language.proficiency, label: language.proficiency.charAt(0).toUpperCase() + language.proficiency.slice(1) }}
                          options={[
                            { value: 'beginner', label: 'Beginner' },
                            { value: 'intermediate', label: 'Intermediate' },
                            { value: 'advanced', label: 'Advanced' },
                            { value: 'native', label: 'Native' },
                          ]}
                          onChange={(option) => handleLanguageChange(index, 'proficiency', option.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2">
                        <BootstrapButton variant="danger" onClick={() => handleRemoveLanguage(index)}>Remove</BootstrapButton>
                      </div>
                    </div>
                  ))}
                  <BootstrapButton variant="primary" onClick={handleAddLanguage}>Add Language</BootstrapButton>
                </div>

                <div className="col-md-6">
                  <label>Training:</label>
                  {localUser.training.map((training, index) => (
                    <div key={index} className="row mb-2">
                      <div className="col-md-4">
                        <input type="text" name="courseName" placeholder="Course Name" value={training.courseName} onChange={(e) => handleTrainingChange(index, 'courseName', e.target.value)} className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <input type="text" name="institution" placeholder="Institution" value={training.institution} onChange={(e) => handleTrainingChange(index, 'institution', e.target.value)} className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <input type="text" name="beginningYear" placeholder="Beginning Year" value={training.beginningYear} onChange={(e) => handleTrainingChange(index, 'beginningYear', e.target.value)} className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <input type="text" name="endingYear" placeholder="Ending Year" value={training.endingYear} onChange={(e) => handleTrainingChange(index, 'endingYear', e.target.value)} className="form-control" />
                      </div>
                      <div className="col-md-6">
                        <input type="url" name="certificateURL" placeholder="Certificate URL" value={training.certificateURL} onChange={(e) => handleTrainingChange(index, 'certificateURL', e.target.value)} className="form-control" />
                      </div>
                      <div className="col-md-2">
                        <BootstrapButton variant="danger" onClick={() => handleRemoveTraining(index)}>Remove</BootstrapButton>
                      </div>
                    </div>
                  ))}
                  <BootstrapButton variant="primary" onClick={handleAddTraining}>Add Training</BootstrapButton>
                </div>
              </div>

              <div className="mb-3">
                <label>Job Posts:</label>
                {localUser.recentJobPosts.map((job, index) => (
                  <div key={index} className="row mb-2">
                    <div className="col-md-4">
                      <input type="text" name="title" placeholder="Title" value={job.title} onChange={(e) => handleJobPostChange(index, 'title', e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-4">
                      <input type="text" name="company" placeholder="Company" value={job.company} onChange={(e) => handleJobPostChange(index, 'company', e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-4">
                      <input type="text" name="startDate" placeholder="Start Date" value={job.startDate} onChange={(e) => handleJobPostChange(index, 'startDate', e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-4">
                      <input type="text" name="endDate" placeholder="End Date" value={job.endDate} onChange={(e) => handleJobPostChange(index, 'endDate', e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <textarea name="description" placeholder="Description" value={job.description} onChange={(e) => handleJobPostChange(index, 'description', e.target.value)} className="form-control"></textarea>
                    </div>
                    <div className="col-md-2">
                      <BootstrapButton variant="danger" onClick={() => handleRemoveJobPost(index)}>Remove</BootstrapButton>
                    </div>
                  </div>
                ))}
                <BootstrapButton variant="primary" onClick={handleAddJobPost}>Add Job Post</BootstrapButton>
              </div>

              <div className="mb-3">
                <BootstrapButton type="submit" variant="success">Save Changes</BootstrapButton>
              </div>
            </form>

            {showError && (
              <div className="alert alert-danger">
                {errorMessage}
                <button type="button" className="close" aria-label="Close" onClick={handleCloseError}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
