const Student = require('../models/Student');
const User = require('../models/User');
const { sequelize } = require('../config/db');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Faculty
const getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: {
                model: User,
                attributes: ['email', 'isActive']
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            email, enrollmentNo, firstName, lastName,
            // Extract other fields if necessary for User creation or validation
            password // Optional, otherwise default to enrollmentNo
        } = req.body;

        // 1. Create User
        // Default password to enrollmentNo if not provided
        const userPassword = password || enrollmentNo;

        const user = await User.create({
            email,
            password: userPassword,
            role: 'STUDENT'
        }, { transaction: t });

        // 2. Create Student Profile
        // Spread the entire body, but ensure userId is set
        const student = await Student.create({
            ...req.body,
            userId: user.id
        }, { transaction: t });

        await t.commit();

        res.status(201).json(student);
    } catch (error) {
        await t.rollback();
        console.error('Error creating student:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get student profile by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: { model: User, attributes: ['email', 'role'] }
        });

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudents, createStudent, getStudentById };
