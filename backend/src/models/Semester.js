const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Semester = sequelize.define('Semester', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING, // "Semester 1"
        allowNull: false
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    academicYearId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY
    },
    endDate: {
        type: DataTypes.DATEONLY
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Semester;
