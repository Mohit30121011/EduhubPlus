const path = require('path');
require('dotenv').config();
const { Department } = require('./src/models');
const { sequelize } = require('./src/config/db');

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const depts = await Department.findAll();
        console.log('Departments:', JSON.stringify(depts, null, 2));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
