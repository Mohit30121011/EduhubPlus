const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    isbn: {
        type: DataTypes.STRING,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publisher: {
        type: DataTypes.STRING
    },
    barcodeId: { // RFID/Barcode
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'ISSUED', 'LOST', 'MAINTENANCE'),
        defaultValue: 'AVAILABLE'
    },
    location: {
        type: DataTypes.STRING // "Shelf A1"
    }
}, {
    timestamps: true
});

module.exports = Book;
