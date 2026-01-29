const { Sequelize } = require('sequelize');
require('dotenv').config();

// PostgreSQL Connection
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false, // Reduced logging for cleaner output
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectPostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connected.');
        // Sync models - using alter: true for dev to auto-update schema
        await sequelize.sync({ alter: true });
        console.log('✅ PostgreSQL Synced.');
    } catch (error) {
        console.error('❌ PostgreSQL Connection Error:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectPostgres };
