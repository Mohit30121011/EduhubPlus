const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Alumni = sequelize.define('Alumni', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    graduationYear: {
        type: DataTypes.INTEGER, // 2024
        allowNull: false
    },
    currentCompany: {
        type: DataTypes.STRING
    },
    designation: {
        type: DataTypes.STRING
    },
    linkedinProfile: {
        type: DataTypes.STRING
    },
    achievements: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

module.exports = Alumni;
