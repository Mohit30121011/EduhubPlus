const { sequelize, connectPostgres } = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await connectPostgres();

        const adminExists = await User.findOne({ where: { role: 'SUPER_ADMIN' } });

        if (adminExists) {
            console.log('⚠️  Super Admin already exists.');
            // Continue to check student
        } else {
            await User.create({
                email: 'admin@icms.com',
                password: 'password123',
                role: 'SUPER_ADMIN',
                isActive: true
            });
            console.log('✅ Super Admin created successfully!');
            console.log('📧 Email: admin@icms.com');
            console.log('🔑 Password: password123');
        }
        // Check for Student
        const studentExists = await User.findOne({ where: { email: 'student@university.edu' } });
        if (!studentExists) {
            await User.create({
                email: 'student@university.edu',
                password: 'password123',
                role: 'STUDENT',
                isActive: true
            });
            console.log('✅ Student User created successfully!');
            console.log('📧 Email: student@university.edu');
        }

        console.log('✅ Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
