const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', protect, authorize('SUPER_ADMIN', 'ADMIN'), registerUser);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
