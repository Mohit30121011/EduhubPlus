const express = require('express');
const router = express.Router();
const { getSchoolProfile, updateSchoolProfile } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/school', protect, getSchoolProfile);
router.put('/school', protect, updateSchoolProfile);

module.exports = router;
