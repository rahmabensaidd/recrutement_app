// routes/candidates.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET candidate details by user ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is a candidate
    if (user.role !== 'candidate') {
      return res.status(400).json({ error: 'User is not a candidate' });
    }

    // Return candidate details
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
      // Add more fields as needed
    });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
