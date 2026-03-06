const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { sequelize } = require('../config/db');

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/setup', async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        res.json({ message: 'Database forcefully synced successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
