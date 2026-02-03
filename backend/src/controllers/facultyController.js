const Faculty = require('../models/Faculty');
const User = require('../models/User');
const { sequelize } = require('../config/db');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private/Admin
const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findAll({
            include: {
                model: User,
                attributes: ['email', 'isActive']
            },
            order: [['createdAt', 'DESC']]
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

        // 2. Parse Body Data
        const parseJSON = (field) => {
            try {
                return typeof field === 'string' ? JSON.parse(field) : field;
            } catch (e) {
                return field;
            }
        };

        const {
            email, firstName, lastName, password,
            contactDetails, identityDetails, academicQualifications,
            professionalDetails, experienceDetails, researchDetails,
            bankDetails, institutionalInfo, emergencyContact, declaration,
            ...otherData
        } = req.body;

        const parsedProfessionalDetails = parseJSON(professionalDetails);
        const employeeId = parsedProfessionalDetails?.employeeCode || `FAC${Date.now()}`;

        const facultyData = {
            ...otherData,
            email, firstName, lastName, employeeId,
            contactDetails: parseJSON(contactDetails),
            identityDetails: parseJSON(identityDetails),
            academicQualifications: parseJSON(academicQualifications),
            ...parsedProfessionalDetails, // Spread flat fields: designation, department, etc.
            experienceDetails: parseJSON(experienceDetails),
            researchDetails: parseJSON(researchDetails),
            bankDetails: parseJSON(bankDetails),
            institutionalInfo: parseJSON(institutionalInfo),
            emergencyContact: parseJSON(emergencyContact),
            declaration: parseJSON(declaration),
            documents, // Attach uploaded docs
            photoUrl: documents.photo ? documents.photo.url : null
        };

        // 3. Create User
        // Default password to employeeId
        const userPassword = password || employeeId;

        const user = await User.create({
            email,
            password: userPassword,
            role: 'FACULTY'
        }, { transaction: t });

        // 4. Create Faculty Profile
        const faculty = await Faculty.create({
            ...facultyData,
            userId: user.id
        }, { transaction: t });

        await t.commit();

        res.status(201).json(faculty);
    } catch (error) {
        await t.rollback();
        console.error('Error creating faculty:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get faculty profile by ID
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findByPk(req.params.id, {
            include: { model: User, attributes: ['email', 'role'] }
        });

        if (faculty) {
            res.json(faculty);
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFaculty, createFaculty, getFacultyById };
