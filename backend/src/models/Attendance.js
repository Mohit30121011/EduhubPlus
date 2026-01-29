const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Student = require('./Student');
const User = require('./User'); // Faculty who marked it

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Student,
            key: 'id'
        }
    },
    markedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    subject: {
        type: DataTypes.STRING, // Should be Subject ID relation eventually
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'),
        defaultValue: 'PRESENT'
    },
    remarks: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['studentId', 'date', 'subject']
        }
    ]
});

// Associations
Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = Attendance;
