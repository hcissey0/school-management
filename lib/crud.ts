import { prisma } from "./prisma";

// CRUD for students

// get all students
export async function getStudents(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
        prisma.student.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        image: true
                    }
                }
            }
        }),
        prisma.student.count()
    ]);

    return {
        students,
        total,
        hasMore: skip + limit < total
    };
}

// get a single student
export async function getStudentByID(ID: string) {
    const student = await prisma.student.findUnique({
        where: {
            ID,
        },
    });
    return student;
}

// create a new student
// will do it later

// update a student
// will do it later

// CRUD for staff

// get all staff
export async function getStaff() {
    const staff = await prisma.staff.findMany();
    return staff;
}

// get a single staff
export async function getStaffByID(id: string) {
    const staff = await prisma.staff.findUnique({
        where: {
            ID: id,
        },
    });
    return staff;
}
