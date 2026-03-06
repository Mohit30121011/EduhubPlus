const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { exec } = require('child_process');
const { sequelize } = require('../config/db');

router.post('/login', loginUser);
router.post('/register', protect, authorize('SUPER_ADMIN', 'ADMIN'), registerUser);

router.get('/seed-all', async (req, res) => {
    try {
        console.log('Force syncing database...');
        await sequelize.sync({ force: true });
        console.log('Database synced. Executing seeder...');
        exec('node src/scripts/seedAll.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ error: error.message, stderr });
            }
            res.status(200).json({ message: 'Seeding complete', stdout });
        });
    } catch (error) {
        console.error('Initial sync error:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
