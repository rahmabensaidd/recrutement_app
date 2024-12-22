// routes/userSettingsRoutes.js
const express = require('express');
const { updateUserSettings } = require('../controllers/UserSettingController');

const router = express.Router();

// PUT request to update user settings
router.put('/:userId/settings',updateUserSettings);

module.exports = router;
