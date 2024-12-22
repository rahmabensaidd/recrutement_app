const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['candidate', 'hr', 'admin'],
    required: true
  },
  personalPhoto: {
    type: String,
    default: ''
  },
  placeOfResidence: {
    city: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    }
  },
  recentJobPosts: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  training: [{
    courseName: String,
    institution: String,
    beginningYear: Number,
    endingYear: Number,
    certificateURL: String
  }],
  mobileNumber: {
    type: String,
    default: ''
  },
  technologies: [String],
  description: {
    type: String,
    default: ''
  },
  professionalTitle: {
    type: String,
    default: ''
  },
  softSkills: [String],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native']
    }
  }],
  hobbies: [String],
  linkedinProfile: {
    type: String,
    default: ''
  },
  githubProfile: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  cvFile: {
    type: String,
    default: ''
  },

});

module.exports = mongoose.model('User', userSchema);
