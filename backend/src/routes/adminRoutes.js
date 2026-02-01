const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users (admin management) - SUPER_ADMIN only
router.get('/users', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'isActive', 'avatar', 'phone', 'dateOfBirth', 'address', 'city', 'state', 'pincode', 'aadhaarNumber', 'joiningDate', 'permissions', 'createdAt'],
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
        const { name, email, password, role, phone, dateOfBirth, address, city, state, pincode, aadhaarNumber, joiningDate, permissions } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'ADMIN',
            phone,
            dateOfBirth,
            address,
            city,
            state,
            pincode,
            aadhaarNumber,
            joiningDate,
            permissions: permissions || []
        });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                aadhaarNumber: user.aadhaarNumber,
                joiningDate: user.joiningDate,
                permissions: user.permissions
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
        const { name, email, role, isActive, password, phone, dateOfBirth, address, city, state, pincode, aadhaarNumber, joiningDate, permissions } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent changing own role or deactivating self
        if (req.user.id === user.id && (role !== user.role || isActive === false)) {
            return res.status(400).json({ success: false, message: 'Cannot change your own role or deactivate yourself' });
        }

        await user.update({
            name: name !== undefined ? name : user.name,
            email: email !== undefined ? email : user.email,
            role: role !== undefined ? role : user.role,
            isActive: isActive !== undefined ? isActive : user.isActive,
            phone: phone !== undefined ? phone : user.phone,
            dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : user.dateOfBirth,
            address: address !== undefined ? address : user.address,
            city: city !== undefined ? city : user.city,
            state: state !== undefined ? state : user.state,
            pincode: pincode !== undefined ? pincode : user.pincode,
            aadhaarNumber: aadhaarNumber !== undefined ? aadhaarNumber : user.aadhaarNumber,
            joiningDate: joiningDate !== undefined ? joiningDate : user.joiningDate,
            permissions: permissions !== undefined ? permissions : user.permissions,
            ...(password && { password })
        });

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                aadhaarNumber: user.aadhaarNumber,
                joiningDate: user.joiningDate,
                permissions: user.permissions
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
