const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Timetable = sequelize.define('Timetable', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING, // e.g. "B.Tech CSE Sem 1 - Section A"
        allowNull: false
    },
    semesterId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING, // "A", "B"
        defaultValue: "A"
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Timetable;
