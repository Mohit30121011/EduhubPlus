const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connections
const { sequelize } = require('./models');

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log('✅ Database & Tables Synced'))
    .catch((err) => console.error('❌ Database Sync Error:', err));

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ICMS API', status: 'Running' });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        uptime: process.uptime(),
        timestamp: Date.now(),
        status: 'OK'
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes')); // Attendance Routes
app.use('/api/master', require('./routes/masterRoutes')); // Master Data Routes
app.use('/api/upload', require('./routes/uploadRoutes')); // File Upload Routes
app.use('/api/import', require('./routes/importRoutes')); // Excel Import Routes

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
