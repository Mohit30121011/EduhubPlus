const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { exec } = require('child_process');

router.post('/login', loginUser);
router.post('/register', protect, authorize('SUPER_ADMIN', 'ADMIN'), registerUser);

router.get('/seed-all', (req, res) => {
    exec('npm run seed', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: error.message, stderr });
        }
        res.status(200).json({ message: 'Seeding complete', stdout });
    });
});

router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
