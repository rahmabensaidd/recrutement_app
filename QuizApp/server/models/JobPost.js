// models/JobPost.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobPostSchema = new Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    vacancies: {
        type: Number,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rhId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming rhId is a reference to a User model
        required: true,
    },
    canId: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming canId is a reference to a Candidate model
        required: false, // Optional if you want it to be nullable
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const JobPost = mongoose.model('JobPost', jobPostSchema);
module.exports = JobPost;
