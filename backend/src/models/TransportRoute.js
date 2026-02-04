const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TransportRoute = sequelize.define('TransportRoute', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    routeName: {
        type: DataTypes.STRING, // "Route 1 - City Center"
        allowNull: false
    },
    startPoint: {
        type: DataTypes.STRING
    },
    endPoint: {
        type: DataTypes.STRING
    },
    stops: {
        type: DataTypes.JSON // Array of stops
    },
    vehicleId: {
        type: DataTypes.UUID
    },
    fees: {
        type: DataTypes.DECIMAL(10, 2)
    }
}, {
    timestamps: true
});

module.exports = TransportRoute;
