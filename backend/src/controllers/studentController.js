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

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            await t.rollback();
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Process Files (Append to existing or replace)
        let documents = student.documents || {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                documents[key] = {
                    name: file.originalname,
                    url: file.path,
                    publicId: file.filename
                };
            });
        }

        // 2. Parse Body Data
        const parseJSON = (field) => {
            try { return typeof field === 'string' ? JSON.parse(field) : field; } catch (e) { return field; }
        };

        const {
            email, enrollmentNo, firstName, lastName,
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
            documents
        };

        // 3. Update Student
        await student.update(studentData, { transaction: t });

        // 4. Update User (Email & Password)
        const userUpdates = {};
        if (email) userUpdates.email = email;
        if (req.body.password && req.body.password.trim() !== '') {
            userUpdates.password = req.body.password;
        }

        if (Object.keys(userUpdates).length > 0) {
            await User.update(userUpdates, { where: { id: student.userId }, individualHooks: true, transaction: t });
        }

        await t.commit();
        res.json(student);
    } catch (error) {
        await t.rollback();
        console.error('Update Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const student = await Student.findByPk(req.params.id);

        if (student) {
            // Delete associated User (Cascade should delete Student)
            await User.destroy({ where: { id: student.userId }, transaction: t });

            await t.commit();
            res.json({ message: 'Student removed' });
        } else {
            await t.rollback();
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudents, createStudent, getStudentById, updateStudent, deleteStudent };
