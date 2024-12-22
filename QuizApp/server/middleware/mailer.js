const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-recruit-email', async (req, res) => {
    const { recruiterEmail, candidateEmail, candidateName, recruiterName } = req.body;
    if (!recruiterEmail || !candidateEmail || !candidateName || !recruiterName) {
        return res.status(400).send('Missing required fields');
      }
    
    console.log('Recruiter Email:', recruiterEmail);
    console.log('Candidate Email:', candidateEmail);
    console.log('Candidate Name:', candidateName);
    console.log('Recruiter Name:', recruiterName);
  
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER, // Utilisez des variables d'environnement
          pass: process.env.GMAIL_PASS
        }
      });
  
    let mailOptions = {
      from: recruiterEmail,
      to: candidateEmail,
      subject: 'Recruitment Opportunity',
      text: `Hello ${candidateName},\n\nYou have been recruited by ${recruiterName}. Please contact us for more details.\n\nBest regards,\n${recruiterName}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    }
  });

module.exports = router;
