// this handles GET and POST requests to /api/students
import { prisma } from "@/lib/prisma";
import { generateUniqueLoginId } from "@/lib/utils";
import { studentSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const gender = searchParams.get('gender') || '';
    const skip = (page - 1) * limit;

    // add gender filter


    const whereClause = {
        AND: [
            search ? {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { ID: { contains: search, mode: 'insensitive' } },
                    { town: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                    { prevalentDisability: { contains: search, mode: 'insensitive' } },
                    { medicalInfo: { contains: search, mode: 'insensitive' } },
                    { phoneNumber: { contains: search, mode: 'insensitive' } },
                    { maritalStatus: ["MARRIED", "SINGLE", "DIVORCED", "WIDOWED"].includes(search.toUpperCase()) ? search.toUpperCase() : undefined },
                    { healthStatus: ["GOOD", "FAIR", "POOR"].includes(search.toUpperCase()) ? search.toUpperCase() : undefined },
                     { tribe: { contains: search, mode: 'insensitive' } },
                    // { languagesSpoken: { has: search, mode: 'insensitive' } },

                    { mothersName: { contains: search, mode: 'insensitive' } },
                    { mothersEmail: { contains: search, mode: 'insensitive' } },
                    { mothersPhone: { contains: search, mode: 'insensitive' } },
                    { mothersOccupation: { contains: search, mode: 'insensitive' } },

                    { fathersName: { contains: search, mode: 'insensitive' } },
                    { fathersEmail: { contains: search, mode: 'insensitive' } },
                    { fathersPhone: { contains: search, mode: 'insensitive' } },
                    { fathersOccupation: { contains: search, mode: 'insensitive' } },

                    { guardiansName: { contains: search, mode: 'insensitive' } },
                    { guardiansEmail: { contains: search, mode: 'insensitive' } },
                    { guardiansPhone: { contains: search, mode: 'insensitive' } },
                    { guardiansOccupation: { contains: search, mode: 'insensitive' } },
                ]
            } : {},
            gender && gender !== 'all' ? {
                gender: ["MALE", "FEMALE", "OTHER"].includes(gender.toUpperCase()) ? gender.toUpperCase() : undefined
            } : {},
        ]
    }

    // const whereClause = search ? {
    //     OR: [
    //         { firstName: { contains: search, mode: 'insensitive' } },
    //         { lastName: { contains: search, mode: 'insensitive' } },
    //         { ID: { contains: search, mode: 'insensitive' } },
    //         { town: { contains: search, mode: 'insensitive' } },
    //         { address: { contains: search, mode: 'insensitive' } },
    //         { prevalentDisability: { contains: search, mode: 'insensitive' } },
    //         { medicalInfo: { contains: search, mode: 'insensitive' } },
    //         { phoneNumber: { contains: search, mode: 'insensitive' } },
    //         { maritalStatus: ["MARRIED", "SINGLE", "DIVORCED", "WIDOWED"].includes(search.toUpperCase()) ? search.toUpperCase() : undefined },
    //         { healthStatus: ["GOOD", "FAIR", "POOR"].includes(search.toUpperCase()) ? search.toUpperCase() : undefined },
    //         //  { tribe: { contains: search, mode: 'insensitive' } },
    //         // { languagesSpoken: { has: search, mode: 'insensitive' } },

    //         { mothersName: { contains: search, mode: 'insensitive' } },
    //         { mothersEmail: { contains: search, mode: 'insensitive' } },
    //         { mothersPhone: { contains: search, mode: 'insensitive' } },
    //         { mothersOccupation: { contains: search, mode: 'insensitive' } },

    //         { fathersName: { contains: search, mode: 'insensitive' } },
    //         { fathersEmail: { contains: search, mode: 'insensitive' } },
    //         { fathersPhone: { contains: search, mode: 'insensitive' } },
    //         { fathersOccupation: { contains: search, mode: 'insensitive' } },

    //         { guardiansName: { contains: search, mode: 'insensitive' } },
    //         { guardiansEmail: { contains: search, mode: 'insensitive' } },
    //         { guardiansPhone: { contains: search, mode: 'insensitive' } },
    //         { guardiansOccupation: { contains: search, mode: 'insensitive' } },
    //     ],
    // } : {};

    const [students, total] = await Promise.all([
        prisma.student.findMany({
            where: whereClause as Prisma.StudentWhereInput,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        }),
        prisma.student.count({ where: whereClause as Prisma.StudentWhereInput })
    ]);

    return NextResponse.json({
        students,
        total,
        hasMore: skip + limit < total
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedBody = studentSchema.parse(body);
        console.log(validatedBody);

        // Use a more robust method to generate unique loginId
        const loginId = await generateUniqueLoginId("STUDENT");

        // Create a new user for the student
        const user = await prisma.user.create({
            data: {
                name: `${validatedBody.firstName} ${validatedBody.lastName}`,
                loginId: loginId,
                password: await bcrypt.hash(loginId, 10),
                role: "STUDENT",
                image: body.image || null,
            },
        });

        // Create a new student
        const student = await prisma.student.create({
            data: {
                ...validatedBody,
                DOB: new Date(validatedBody.DOB),
                ID: loginId,
                userId: user.id  // Use userId instead of nested connect
            }
        });

        return NextResponse.json({
            student,
            user,
            message: "Student created successfully"
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to create student"
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        // Delete the student and associated user
        const student = await prisma.student.delete({
            where: { id },
            include: { user: true }
        });

        // Delete the associated user
        if (student.user) {
            await prisma.user.delete({
                where: { id: student.user.id }
            });
        }

        return NextResponse.json({
            message: "Student deleted successfully",
            student
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json({
            error: "Failed to delete student"
        }, { status: 500 });
    }
}
