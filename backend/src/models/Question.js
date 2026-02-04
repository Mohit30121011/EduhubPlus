const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quizId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    options: {
        type: DataTypes.JSON, // e.g. ["Option A", "Option B", "Option C", "Option D"]
        allowNull: false
    },
    correctAnswer: {
        type: DataTypes.INTEGER, // Index of correct option (0-3)
        allowNull: false
    },
    marks: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true
});

module.exports = Question;
