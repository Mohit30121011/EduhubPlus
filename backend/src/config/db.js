const { Sequelize } = require('sequelize');
require('dotenv').config();

// PostgreSQL Connection
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false // Often needed for hosted DBs like Heroku/Render/AWS RDS if using self-signed certs
        }
    } : {},
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
