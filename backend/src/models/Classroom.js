const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Classroom = sequelize.define('Classroom', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    roomNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    type: {
        type: DataTypes.ENUM('LECTURE_HALL', 'LAB', 'SEMINAR_ROOM'),
        defaultValue: 'LECTURE_HALL'
    },
    resources: {
        type: DataTypes.JSON, // e.g. ["Projector", "AC", "Whiteboard"]
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = Classroom;
