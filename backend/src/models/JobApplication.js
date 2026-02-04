const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const JobApplication = sequelize.define('JobApplication', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    driveId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'),
        defaultValue: 'APPLIED'
    },
    remarks: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

module.exports = JobApplication;
