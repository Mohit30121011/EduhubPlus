const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`[LOGIN ATTEMPT] Email: ${email}`);
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('[LOGIN FAILED] User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`[LOGIN] User found: ${user.email}, Role: ${user.role}`);
        const isMatch = await user.comparePassword(password);
        console.log(`[LOGIN] Password match: ${isMatch}`);

        if (isMatch) {
            const token = generateToken(user.id);
            console.log(`[LOGIN SUCCESS] Token generated`);
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                permissions: user.permissions || [],
                token: token,
            });
        } else {
            console.log('[LOGIN FAILED] Password mismatch');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('[LOGIN ERROR] Exception:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Register a new user (For Admin use)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                // token: generateToken(user.id) // Usually admin creates user, so no token needed for response
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser.id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating profile' });
    }
};

module.exports = { loginUser, registerUser, updateProfile };
