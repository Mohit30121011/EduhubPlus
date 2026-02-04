const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TimeSlot = sequelize.define('TimeSlot', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    timetableId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    dayOfWeek: {
        type: DataTypes.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    subjectId: {
        type: DataTypes.UUID
    },
    facultyId: {
        type: DataTypes.UUID
    },
    classroomId: {
        type: DataTypes.UUID
    }
}, {
    timestamps: true
});

module.exports = TimeSlot;
