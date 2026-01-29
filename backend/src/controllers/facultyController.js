const Faculty = require('../models/Faculty');
const User = require('../models/User');
const { sequelize } = require('../config/db');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private
const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findAll({
            include: {
                model: User,
                attributes: ['email', 'isActive']
            },
            order: [['firstName', 'ASC']]
        });
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new faculty
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            email, password, employeeId, firstName, lastName,
            designation, department, specialization, phone
        } = req.body;

        // 1. Create User
        const user = await User.create({
            email,
            password,
            role: 'FACULTY'
        }, { transaction: t });

        // 2. Create Faculty Profile
        const faculty = await Faculty.create({
            userId: user.id,
            employeeId,
            firstName,
            lastName,
            designation,
            department,
            specialization,
            phone
        }, { transaction: t });

        await t.commit();
        res.status(201).json(faculty);

    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getFaculty, createFaculty };
