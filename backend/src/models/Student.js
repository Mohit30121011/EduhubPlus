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
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER')
    },
    email: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    },
    department: {
        type: DataTypes.STRING // Could be FK to a Department model later
    },
    course: {
        type: DataTypes.STRING
    },
    currentSemester: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    photoUrl: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

// Associations
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

module.exports = Student;
