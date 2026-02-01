const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    enrollmentNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Personal Information (Core)
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING },
    dateOfBirth: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER') },

    // Additional Personal Info
    regionalName: { type: DataTypes.STRING },
    previousName: { type: DataTypes.STRING },
    nationality: { type: DataTypes.STRING },
    placeOfBirth: { type: DataTypes.STRING },
    domicileState: { type: DataTypes.STRING },
    category: { type: DataTypes.ENUM('GENERAL', 'OBC', 'SC', 'ST', 'EWS') },
    subCategory: { type: DataTypes.STRING },
    aadharNumber: { type: DataTypes.STRING },
    passportNumber: { type: DataTypes.STRING },
    religion: { type: DataTypes.STRING },
    motherTongue: { type: DataTypes.STRING },
    maritalStatus: { type: DataTypes.STRING },
    abcId: { type: DataTypes.STRING },

    // JSON Groups
    contactDetails: { type: DataTypes.JSON }, // permanentAddress, correspondenceAddress, alternateMobile, alternateEmail, emergencyContact
    familyDetails: { type: DataTypes.JSON }, // father, mother, guardian, localGuardian
    academicHistory: { type: DataTypes.JSON }, // classX, classXII, graduation
    entranceExam: { type: DataTypes.JSON }, // examDetails

    // Admission Details
    department: { type: DataTypes.STRING }, // Top level for filtering
    course: { type: DataTypes.STRING }, // Top level for filtering
    currentSemester: { type: DataTypes.INTEGER, defaultValue: 1 },
    admissionDetails: { type: DataTypes.JSON }, // programLevel, choicePreference, modeOfStudy, admissionType, academicSession

    // Other Details
    hostelTransport: { type: DataTypes.JSON }, // hostel, transport
    medicalInfo: { type: DataTypes.JSON }, // bloodGroup, disability, medical
    documents: { type: DataTypes.JSON }, // URLs for photo, signature, marksheets
    feeDetails: { type: DataTypes.JSON }, // applicationFee, paymentMode, transactionId

    // Office Use
    applicationStatus: {
        type: DataTypes.ENUM('PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING'
    },
    officeInfo: { type: DataTypes.JSON } // verificationStatus, verifiedBy, remarks, allotmentNumber

}, {
    timestamps: true
});

// Associations
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

module.exports = Student;
