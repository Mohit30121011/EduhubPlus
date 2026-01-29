const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    duration: {
        type: DataTypes.INTEGER, // Years or Semesters
        allowNull: false,
        defaultValue: 4
    },
    type: {
        type: DataTypes.ENUM('Semester', 'Yearly'),
        defaultValue: 'Semester'
    }
}, {
    timestamps: true
});

module.exports = Course;
