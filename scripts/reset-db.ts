import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateUniqueLoginId } from '../lib/utils';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function resetDatabase() {
    console.log('🗑️ Starting database reset...');

    try {
        // Delete all existing records in the order that respects foreign key constraints
        await prisma.student.deleteMany();
        await prisma.staff.deleteMany();
        await prisma.user.deleteMany();
        await prisma.class.deleteMany();
        await prisma.course.deleteMany();
        await prisma.department.deleteMany();
        await prisma.event.deleteMany();
        await prisma.announcement.deleteMany();
        await prisma.book.deleteMany();
        await prisma.building.deleteMany();
        await prisma.classLocation.deleteMany();
        await prisma.feedback.deleteMany();
        await prisma.grade.deleteMany();
        await prisma.library.deleteMany();
        await prisma.report.deleteMany();
        await prisma.timetable.deleteMany();

        console.log('✅ All existing records deleted successfully');

        // Create an admin user
        const adminLoginId = await generateUniqueLoginId('ADMIN');
        const adminUser = await prisma.user.create({
            data: {
                name: 'System Administrator',
                loginId: adminLoginId,
                password: await bcrypt.hash(adminLoginId, 10),
                role: 'ADMIN',
            },
        });

        console.log(`🔐 Admin user created with login ID: ${adminLoginId}`);
        console.log(`🔑 Admin initial password is the same as login ID: ${adminLoginId}`);

        console.log('🎉 Database reset and initial setup completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error during database reset:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

function askConfirmation(): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('This will reset the entire database. Are you sure? (y/n): ', (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

async function main() {
    try {
        const confirmed = await askConfirmation();

        if (!confirmed) {
            console.log('Database reset cancelled.');
            process.exit(0);
        }

        const success = await resetDatabase();

        if (success) {
            console.log('Database reset completed successfully.');
            process.exit(0);
        } else {
            console.log('Database reset failed.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        process.exit(1);
    }
}

// Call the main function
main();
