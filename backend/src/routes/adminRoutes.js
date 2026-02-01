const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users (admin management) - SUPER_ADMIN only
router.get('/users', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

// Create new admin/user - SUPER_ADMIN only
router.post('/users', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'ADMIN'
        });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

// Update user - SUPER_ADMIN only
router.put('/users/:id', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const { name, email, role, isActive, password } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent changing own role or deactivating self
        if (req.user.id === user.id && (role !== user.role || isActive === false)) {
            return res.status(400).json({ success: false, message: 'Cannot change your own role or deactivate yourself' });
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            role: role || user.role,
            isActive: isActive !== undefined ? isActive : user.isActive,
            ...(password && { password })
        });

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});

// Delete user - SUPER_ADMIN only
router.delete('/users/:id', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent deleting self
        if (req.user.id === user.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
        }

        await user.destroy();
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

module.exports = router;
