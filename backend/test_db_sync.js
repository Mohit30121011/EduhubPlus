const { sequelize } = require('./src/models');

const testSync = async () => {
    try {
        await sequelize.authenticate();
        console.log('Authentication successful.');
        await sequelize.sync({ alert: true }); // Dry run basically
        console.log('Sync check successful.');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
};

testSync();
