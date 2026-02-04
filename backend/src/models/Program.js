const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Program = sequelize.define('Program', {
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
    departmentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER, // e.g. 4 years
        defaultValue: 4
    },
    totalSemesters: {
        type: DataTypes.INTEGER,
        defaultValue: 8
    }
}, {
    timestamps: true
});

module.exports = Program;
