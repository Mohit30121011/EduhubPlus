const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDatabase = () => {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../backups');
    const fileName = `backup-${timestamp}.sql`;
    const filePath = path.join(backupDir, fileName);

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`📦 Starting Database Backup: ${fileName}`);

    // Command to dump database
    // Assuming POSTGRES_URI is in format: postgres://user:pass@host:port/dbname
    // pg_dump can accept the connection string directly via -d flag or just as argument
    const connectionString = process.env.POSTGRES_URI;

    if (!connectionString) {
        console.error('❌ Backup Failed: POSTGRES_URI not found in environment variables.');
        return;
    }

    // Using pg_dump with connection string
    // Note: Password execution might require .pgpass file or PGPASSWORD env var. 
    // Setting PGPASSWORD inline is less secure but often necessary for simple node scripts without complex config.
    // However, exec works in a shell, so we can set env vars for the command.

    // Attempting to parse connection string to get password separately if needed, 
    // but pg_dump handles connection strings well.

    const command = `pg_dump "${connectionString}" -F c > "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Backup Failed: ${error.message}`);
            return;
        }
        if (stderr) {
            // pg_dump often writes info to stderr, so we don't treat all stderr as failure
            // but we log it.
            console.log(`ℹ️ Backup Output: ${stderr}`);
        }
        console.log(`✅ Backup Completed Successfully: ${filePath}`);

        // Optional: Delete backups older than 7 days
        cleanupOldBackups(backupDir);
    });
};

const cleanupOldBackups = (dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) return console.error('❌ Cleanup Error:', err);

        const now = Date.now();
        const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

        files.forEach(file => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                if (now - stats.mtime.getTime() > MAX_AGE) {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`❌ Failed to delete old backup ${file}:`, err);
                        else console.log(`🗑️ Deleted old backup: ${file}`);
                    });
                }
            });
        });
    });
};

const initBackupService = () => {
    // Schedule task to run every day at midnight (00:00)
    cron.schedule('0 0 * * *', () => {
        console.log('⏰ Running Scheduled Daily Backup...');
        backupDatabase();
    });

    console.log('🛡️ Backup Service Initialized: Scheduled for 00:00 Daily');
};

module.exports = { initBackupService, backupDatabase };
