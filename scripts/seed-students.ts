// import { PrismaClient, Gender, HealthStatus, MaritalStatus } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { generateUniqueLoginId, getId } from '../lib/utils';

// const prisma = new PrismaClient();

// const languages = ['English', 'Swahili', 'French', 'Arabic', 'Spanish', 'Portuguese', 'Chinese'];
// const tribes = ['Kikuyu', 'Luo', 'Luhya', 'Kamba', 'Kalenjin', 'Kisii', 'Meru'];
// const towns = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Malindi'];

// function getRandomElement<T>(array: T[]): T {
//     return array[Math.floor(Math.random() * array.length)];
// }

// function getRandomElements<T>(array: T[], count: number): T[] {
//     const shuffled = [...array].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, count);
// }

// async function seedStudents() {
//     try {
//         // Clear existing data
//         await prisma.student.deleteMany();
//         await prisma.user.deleteMany();

//         const studentsToCreate = 100;

//         for (let i = 0; i < studentsToCreate; i++) {
//             const firstName = `Student${i + 1}`;
//             const lastName = `LastName${i + 1}`;
//             const loginId = await generateUniqueLoginId("STUDENT")

//             // Create user first
//             const user = await prisma.user.create({
//                 data: {
//                     name: `${firstName} ${lastName}`,
//                     loginId,
//                     password: await bcrypt.hash(loginId, 10),
//                     role: 'STUDENT',
//                 }
//             });

//             // Create student with random data
//             await prisma.student.create({
//                 data: {
//                     ID: loginId,
//                     firstName,
//                     lastName,
//                     DOB: new Date(1990 + Math.floor(Math.random() * 20),
//                         Math.floor(Math.random() * 12),
//                         Math.floor(Math.random() * 28)),
//                     gender: getRandomElement(['MALE', 'FEMALE', 'OTHER'] as Gender[]),
//                     address: `${Math.floor(Math.random() * 1000)} Sample Street`,
//                     town: getRandomElement(towns),
//                     phoneNumber: `+254${Math.floor(Math.random() * 1000000000)}`,
//                     tribe: getRandomElement(tribes),
//                     prevalentDisability: Math.random() > 0.9 ? 'None' : 'None',
//                     medicalInfo: Math.random() > 0.9 ? 'None' : 'None',
//                     healthStatus: getRandomElement(['GOOD', 'FAIR', 'POOR'] as HealthStatus[]),
//                     languagesSpoken: getRandomElements(languages, Math.floor(Math.random() * 3) + 1),
//                     maritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

//                     // Mother's information
//                     mothersName: `Mother of ${firstName}`,
//                     mothersEmail: Math.random() > 0.5 ? `mother${i}@example.com` : 'None',
//                     mothersPhone: `+254${Math.floor(Math.random() * 1000000000)}`,
//                     mothersOccupation: 'Teacher',
//                     mothersMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

//                     // Father's information
//                     fathersName: `Father of ${firstName}`,
//                     fathersEmail: Math.random() > 0.5 ? `father${i}@example.com` : 'None',
//                     fathersPhone: `+254${Math.floor(Math.random() * 1000000000)}`,
//                     fathersOccupation: 'Engineer',
//                     fathersMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

//                     // Guardian's information
//                     guardiansName: `Guardian of ${firstName}`,
//                     guardiansEmail: Math.random() > 0.5 ? `guardian${i}@example.com` : 'None',
//                     guardiansPhone: `+254${Math.floor(Math.random() * 1000000000)}`,
//                     guardiansOccupation: 'Business Person',
//                     guardiansMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

//                     // Connect to user
//                     userId: user.id
//                 }
//             });

//             console.log(`Created student ${i + 1} of ${studentsToCreate}`);
//         }

//         console.log('Seeding completed successfully');
//     } catch (error) {
//         console.error('Error seeding database:', error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// seedStudents();


import { PrismaClient, Gender, HealthStatus, MaritalStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateUniqueLoginId } from '../lib/utils';
import { generateGhanaianStudent } from './seed-utils';

import { faker } from '@faker-js/faker';


const prisma = new PrismaClient();

async function seedStudents(studentsToCreate: number = 50) {
    console.log(`🌱 Seeding ${studentsToCreate} students...`);

    const createdStudents = [];

    for (let i = 0; i < studentsToCreate; i++) {
        try {
            // Generate student data
            const studentData = generateGhanaianStudent();

            // Generate unique login ID
            const loginId = await generateUniqueLoginId("STUDENT");

            // Create user first
            const user = await prisma.user.create({
                data: {
                    name: `${studentData.firstName} ${studentData.lastName}`,
                    loginId: loginId,
                    password: await bcrypt.hash(loginId, 10),
                    role: "STUDENT",
                },
            });

            // Create student
            const student = await prisma.student.create({
                data: {
                    ...studentData,
                    DOB: new Date(studentData.DOB),
                    ID: loginId,
                    userId: user.id
                }
            });

            createdStudents.push(student);
            console.log(`✅ Created student: ${student.firstName} ${student.lastName} (${loginId})`);
        } catch (error) {
            console.error(`❌ Error creating student ${i + 1}:`, error);
        }
    }

    console.log(`🎉 Successfully created ${createdStudents.length} students`);
    return createdStudents;
}

async function main() {
    try {
        await seedStudents(50);
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// main();

// using a faker write code to seed the students with realistic data
// use the generateGhanaianStudent function to generate the student data
// generate a unique loginId for each student
// create a user for each student
// create a student for each user
// log the created student to the console

async function seedGhanaianStudent() {
    try {
        // Clear existing data
        await prisma.student.deleteMany();
        await prisma.user.deleteMany();

        const studentsToCreate = 100;



        for (let i = 0; i < studentsToCreate; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const loginId = await generateUniqueLoginId("STUDENT");
            console.log("The Id is ===============", loginId)

            // Generate user's image using canvas
            // const canvas = document.createElement('canvas');
            // const ctx = canvas.getContext('2d');
            // const width = 100;
            // const height = 100;
            // canvas.width = width;
            // canvas.height = height;
            // if (ctx) {
            //     ctx.fillStyle = faker.internet.color();
            //     ctx.fillRect(0, 0, width, height);
            // }
            // const userImage = canvas.toDataURL();

            // Create user first
            const user = await prisma.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    loginId: await generateUniqueLoginId("STUDENT"),
                    password: await bcrypt.hash(loginId, 10),
                    role: 'STUDENT',
                    image: faker.image.dataUri({ width: 100, height: 100,  }),
                }
            });

            // Create student with random data
            // await prisma.student.create({
            //     data: {
            //         ID: loginId,
            //         firstName,
            //         lastName,
            //         DOB: new Date(1990 + Math.floor(Math.random() * 20),
            //             Math.floor(Math.random() * 12),
            //             Math.floor(Math.random() * 28)),
            //         gender: getRandomElement(['MALE', 'FEMALE', 'OTHER'] as Gender[]),
            //         address: `${Math.floor(Math.random() * 1000)} Sample Street`,
            //         town: getRandomElement(towns),
            //         phoneNumber: `+254${Math.floor(Math.random() * 1000000000)}`,
            //         tribe: getRandomElement(tribes),
            //         prevalentDisability: Math.random() > 0.9 ? 'None' : 'None',
            //         medicalInfo: Math.random() > 0.9 ? 'None' : 'None',
            //         healthStatus: getRandomElement(['GOOD', 'FAIR', 'POOR'] as HealthStatus[]),
            //         languagesSpoken: getRandomElements(languages, Math.floor(Math.random() * 3) + 1),
            //         maritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

            //         // Mother's information
            //         mothersName: `Mother of ${firstName}`,
            //         mothersEmail: Math.random() > 0.5 ? `mother${i}@example.com` : 'None',
            //         mothersPhone: `+254${Math.floor(Math.random() * 1000000000)}`,
            //         mothersOccupation: 'Teacher',
            //         mothersMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

            //         // Father's information
            //         fathersName: `Father of ${firstName}`,
            //         fathersEmail: Math.random() > 0.5 ? `father${i}@example.com` : 'None',
            //         fathersPhone: `+254${Math.floor(Math.random() * 1000000000)}`,
            //         fathersOccupation: 'Engineer',
            //         fathersMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

            //         // Guardian's information
            //         guardiansName: `Guardian of ${firstName}`,
            //         guardiansEmail: Math.random() > 0.5 ? `guardian${i}@example.com` : 'None',
            //         guardiansPhone: `+254${Math.floor(Math.random() * 1000000000)}`,
            //         guardiansOccupation: 'Business Person',
            //         guardiansMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as MaritalStatus[]),

            //         // Connect to user
            //         userId: user.id
            //     }
            // });
            // console.log('Seeding completed successfully');


            const student = await prisma.student.create({
                data: {
                    ID: loginId,
                    firstName,
                    lastName,
                    DOB: faker.date.past(),
                    gender: faker.person.sex().toUpperCase() as Gender,
                    address: faker.location.streetAddress(),
                    town: faker.location.state(),
                    phoneNumber: faker.phone.number({ style: 'international' }),
                    tribe: getRandomElement(['Akan', 'Ewe', 'Ga', 'Fante', 'Ashanti', 'Dagomba']),
                    prevalentDisability: faker.datatype.boolean() ? 'None' : faker.word.adjective(),
                    medicalInfo: faker.datatype.boolean() ? 'None' : faker.word.adjective(),
                    healthStatus: getRandomElement(['GOOD', 'FAIR', 'POOR']),
                    languagesSpoken: getRandomElements(['English', 'Twi', 'Ga', 'Ewe'], faker.number.int(4)),
                    maritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),

                    // Mother's information
                    mothersName: faker.person.fullName({ sex: 'female'}),
                    mothersEmail: faker.internet.email(),
                    mothersPhone: faker.phone.number({ style: 'international' }),
                    mothersOccupation: faker.person.jobTitle(),
                    mothersMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),

                    // Father's information
                    fathersName: faker.person.fullName(),
                    fathersEmail: faker.internet.email(),
                    fathersPhone: faker.phone.number(),
                    fathersOccupation: faker.person.jobTitle(),
                    fathersMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),

                    // Guardian's information
                    guardiansName: faker.person.fullName(),
                    guardiansEmail: faker.internet.email(),
                    guardiansPhone: faker.phone.number(),
                    guardiansOccupation: faker.person.jobTitle(),
                    guardiansMaritalStatus: getRandomElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),

                    // Connect to user
                    userId: user.id
                }
            });

            console.log(`Created student ${i + 1} of ${studentsToCreate}`);
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
        console.error('Error seeding database:');
}
seedGhanaianStudent();

// now write those functions and variables you used
// getRandomElement
// getRandomElements
// towns
// tribes
// languages

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const languages = ['English', 'Swahili', 'French', 'Arabic', 'Spanish', 'Portuguese', 'Chinese'];

const tribes = ['Kikuyu', 'Luo', 'Luhya', 'Kamba', 'Kalenjin', 'Kisii', 'Meru'];

const towns = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Malindi'];
seedGhanaianStudent();

