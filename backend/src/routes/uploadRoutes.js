const express = require('express');
const router = express.Router();
const { uploadAvatar, uploadLogo } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const SchoolProfile = require('../models/SchoolProfile');

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update user's avatar in database
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatar = req.file.path; // Cloudinary URL
        await user.save();

        res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatar: req.file.path
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ message: 'Error uploading avatar' });
    }
});

// @desc    Upload school logo
// @route   POST /api/upload/logo
// @access  Private
router.post('/logo', protect, uploadLogo.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update or create school profile with logo
        let profile = await SchoolProfile.findOne();

        if (profile) {
            profile.logoUrl = req.file.path;
            await profile.save();
        } else {
            profile = await SchoolProfile.create({
                logoUrl: req.file.path,
                schoolName: 'My School',
                email: 'admin@school.com'
            });
        }

        res.status(200).json({
            message: 'Logo uploaded successfully',
            logoUrl: req.file.path
        });
    } catch (error) {
        console.error('Logo upload error:', error);
        res.status(500).json({ message: 'Error uploading logo' });
    }
});

module.exports = router;
