import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/zod";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { ID: string}}) {

    const ID = params.ID;

    const student = await prisma.student.findUnique({
        where: {
            ID
        },
        include: {
            user: true,
            class: true,
            attentance: true,
            grades: true,
            reports: true,
        }
    })

    if (!student) return NextResponse.json({
        message: "Student not found"
    }, {status:404})

    return NextResponse.json({
        student
    })
}


export async function POST(request: Request) {
    const body = await request.json();
    const validatedbody = studentSchema.parse(body)
}
