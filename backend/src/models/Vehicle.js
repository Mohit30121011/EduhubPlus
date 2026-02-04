const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('BUS', 'VAN', 'CAR'),
        defaultValue: 'BUS'
    },
    capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 40
    },
    driverName: {
        type: DataTypes.STRING
    },
    driverPhone: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
    }
}, {
    timestamps: true
});

module.exports = Vehicle;
