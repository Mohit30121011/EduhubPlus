const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('IT', 'FURNITURE', 'LAB_EQUIPMENT', 'SPORTS', 'OTHER'),
        defaultValue: 'IT'
    },
    purchaseDate: {
        type: DataTypes.DATEONLY
    },
    value: {
        type: DataTypes.DECIMAL(10, 2)
    },
    location: { // Could be Classroom ID or String
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'DAMAGED', 'DISPOSED', 'MAINTENANCE'),
        defaultValue: 'ACTIVE'
    }
}, {
    timestamps: true
});

module.exports = Asset;
