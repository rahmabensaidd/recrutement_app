const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const assignmentRoutes = require('./routes/assignmentRoutes');
const candidateRoutes=require('./routes/candidates');
const resultQuizRoutes=require('./routes/resultQuizRoutes');
const requestRoutes= require ('./routes/requestRoutes');
const path = require('path');
const resultRoutes=require('./routes/Resultroutes');
const postsRoutes=require('./routes/JobPostRoute');
//const generateQuizRouter =require('./routes/generateQuiz');
const app = express();

// Load environment variables
require('dotenv').config();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // URL de votre application front-end
  methods: ['GET', 'POST'], // Méthodes autorisées
  allowedHeaders: ['Content-Type'], // En-têtes autorisés
};

// CORS pour toutes les routes
app.options('*', cors(corsOptions));

// Route principale
app.get('/', (req, res) => {
  res.send('Hello World');
});


// Routes spécifiques
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/result',resultRoutes)
//app.use('/api/resultQuizzes', resultQuizRoutes);
app.use('/api/request', requestRoutes);
app.use ('/api/resultQuizzes',resultQuizRoutes);
app.use('/api/posts',postsRoutes);
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
//app.use('/api/ai', generateQuizRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
