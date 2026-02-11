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

// @desc    Forgot Password - Generate OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.update({
            resetOtp: otp,
            resetOtpExpiry: otpExpiry
        });

        console.log(`[PASSWORD RESET] OTP for ${email}: ${otp}`);

        res.json({
            message: 'OTP has been generated. Check console/logs for the OTP.',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (error) {
        console.error('[FORGOT PASSWORD ERROR]', error);
        res.status(500).json({ message: 'Server error processing request' });
    }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > new Date(user.resetOtpExpiry)) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        await user.update({
            password: newPassword,
            resetOtp: null,
            resetOtpExpiry: null
        });

        res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        console.error('[RESET PASSWORD ERROR]', error);
        res.status(500).json({ message: 'Server error resetting password' });
    }
};

module.exports = { loginUser, registerUser, updateProfile, forgotPassword, resetPassword };
