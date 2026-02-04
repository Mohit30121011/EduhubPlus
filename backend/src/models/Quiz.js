const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quiz = sequelize.define('Quiz', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    totalMarks: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 60
    },
    startTime: {
        type: DataTypes.DATE
    },
    endTime: {
        type: DataTypes.DATE
    },
    createdBy: {
        type: DataTypes.UUID // Faculty ID
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Quiz;
