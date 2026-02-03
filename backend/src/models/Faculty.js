const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Faculty = sequelize.define('Faculty', {
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
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // 1. Personal Information
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER') },
    dateOfBirth: { type: DataTypes.DATEONLY },
    nationality: { type: DataTypes.STRING },
    maritalStatus: { type: DataTypes.STRING },
    bloodGroup: { type: DataTypes.STRING },
    photoUrl: { type: DataTypes.STRING },

    // 2. Contact Details
    email: { type: DataTypes.STRING }, // Official
    personalEmail: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    alternatePhone: { type: DataTypes.STRING },
    contactDetails: { type: DataTypes.JSON }, // currentAddress, permanentAddress

    // 3. Identification Details
    identityDetails: { type: DataTypes.JSON }, // aadhaar, passport, voterId, pan

    // 4. Academic Qualifications
    academicQualifications: { type: DataTypes.JSON }, // Array of { qualification, degree, subject, university, year, percentage }

    // 5. Professional Details
    designation: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING }, // Linked to Department Model logic? String for now.
    facultyType: { type: DataTypes.STRING }, // Permanent, Contract, Guest
    joinDate: { type: DataTypes.DATEONLY },
    natureOfAppointment: { type: DataTypes.STRING },

    // 6. Experience Details
    experienceDetails: { type: DataTypes.JSON }, // totalTeachingExp, industryExp, previousInstitutions: []

    // 7. Research & Academic Contributions
    researchDetails: { type: DataTypes.JSON }, // publications, researchArea, phdStatus, guideDetails, patents, projects

    // 8. Bank & Payroll Details
    bankDetails: { type: DataTypes.JSON }, // bankName, accountNo, ifsc, branch, pan

    // 9 & 12. Documents & Declaration
    documents: { type: DataTypes.JSON }, // Resume, Certificates keys
    declaration: { type: DataTypes.JSON }, // signature, date, place

    // 10. Emergency Contact
    emergencyContact: { type: DataTypes.JSON },

    // 11. Institutional Information
    institutionalInfo: { type: DataTypes.JSON }, // subjects, timetable, committees

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

// Associations
User.hasOne(Faculty, { foreignKey: 'userId', onDelete: 'CASCADE' });
Faculty.belongsTo(User, { foreignKey: 'userId' });

module.exports = Faculty;
