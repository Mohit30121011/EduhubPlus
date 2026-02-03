require('dotenv').config({ path: 'd:/EduhubPlus/backend/.env' });
const { backupDatabase } = require('./src/services/backupService');

console.log('Testing Backup Service...');
backupDatabase();
