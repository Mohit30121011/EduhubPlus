const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PlacementDrive = sequelize.define('PlacementDrive', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    package: {
        type: DataTypes.STRING // "12 LPA"
    },
    eligibilityCriteria: {
        type: DataTypes.TEXT // "CGPA > 7.0"
    },
    driveDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING
    },
    deadline: {
        type: DataTypes.DATE
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = PlacementDrive;
