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
        // 1. Process Files
        const documents = {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                documents[key] = {
                    name: file.originalname,
                    url: file.path, // Cloudinary URL
                    publicId: file.filename
                };
            });
        }

        // 2. Parse Body Data (FormData sends everything as strings)
        const parseJSON = (field) => {
            try {
                return typeof field === 'string' ? JSON.parse(field) : field;
            } catch (e) {
                return field;
            }
        };

        const {
            email, enrollmentNo, firstName, lastName, password,
            contactDetails, familyDetails, academicHistory,
            admissionDetails, hostelTransport, medicalInfo,
            feeDetails, entranceExam, ...otherData
        } = req.body;

        const studentData = {
            ...otherData,
            email, enrollmentNo, firstName, lastName,
            contactDetails: parseJSON(contactDetails),
            familyDetails: parseJSON(familyDetails),
            academicHistory: parseJSON(academicHistory),
            admissionDetails: parseJSON(admissionDetails),
            hostelTransport: parseJSON(hostelTransport),
            medicalInfo: parseJSON(medicalInfo),
            feeDetails: parseJSON(feeDetails),
            entranceExam: parseJSON(entranceExam),
            documents // Attach uploaded docs
        };

        // 3. Create User
        // Default password to enrollmentNo if not provided
        const userPassword = password || enrollmentNo;

        const user = await User.create({
            email,
            password: userPassword,
            role: 'STUDENT'
        }, { transaction: t });

        // 4. Create Student Profile
        const student = await Student.create({
            ...studentData,
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
