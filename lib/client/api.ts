'use client'

import { Student } from "@prisma/client";

export const getStudentByID = async (ID: string) => {
    const data = await fetch(`/api/students/${ID}`);
    const res = await data.json();

    return res as Student;
}
