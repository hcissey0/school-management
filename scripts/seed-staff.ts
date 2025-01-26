import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateUniqueLoginId } from '../lib/utils';
import { generateGhanaianStaff } from './seed-utils';

const prisma = new PrismaClient();

async function seedStaff(staffToCreate: number = 20) {
    console.log(`🌱 Seeding ${staffToCreate} staff members...`);

    const createdStaff = [];

    for (let i = 0; i < staffToCreate; i++) {
        try {
            // Generate staff data
            const staffData = generateGhanaianStaff();
            
            // Generate unique login ID
            const loginId = await generateUniqueLoginId("STAFF");

            // Create user first
            const user = await prisma.user.create({
                data: {
                    name: `${staffData.firstName} ${staffData.lastName}`,
                    loginId: loginId,
                    password: await bcrypt.hash(loginId, 10),
                    role: "STAFF",
                },
            });

            // Create staff
            const staff = await prisma.staff.create({
                data: {
                    ...staffData,
                    DOB: new Date(staffData.DOB),
                    ID: loginId,
                    userId: user.id
                }
            });

            createdStaff.push(staff);
            console.log(`✅ Created staff: ${staff.firstName} ${staff.lastName} (${loginId})`);
        } catch (error) {
            console.error(`❌ Error creating staff member ${i + 1}:`, error);
        }
    }

    console.log(`🎉 Successfully created ${createdStaff.length} staff members`);
    return createdStaff;
}

async function main() {
    try {
        await seedStaff(20);
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
