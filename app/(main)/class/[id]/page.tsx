import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

async function getClass(id: string) {
    const classData = await prisma.class.findUnique({
        where: { id },
        include: {
            teacher: {
                include: {
                    user: true
                }
            },
            department: true,
            students: true,
            timetable: {
                include: {
                    course: true,
                    classLocation: true
                }
            }
        },
    })

    if (!classData) {
        notFound()
    }

    return classData
}

export default async function ClassProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        return <div>You do not have permission to view this page.</div>
    }

    const classData = await getClass(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Class Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Class Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Class Name:</span>
                            <span>{classData.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Class ID:</span>
                            <span>{classData.ID}</span>
                        </div>
                        <div>
                            <span className="font-medium">Department:</span>
                            <span>{classData.department.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Teacher:</span>
                            <Link href={`/staff/${classData.teacher.id}`} className="text-blue-600 hover:underline">
                                {classData.teacher.firstName} {classData.teacher.lastName}
                            </Link>
                        </div>
                        <div>
                            <span className="font-medium">Number of Students:</span>
                            <span>{classData.students.length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Timetable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Time</th>
                                    <th>Course</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classData.timetable.map((slot) => (
                                    <tr key={slot.id}>
                                        <td>{slot.dayOfWeek}</td>
                                        <td>{slot.startTime.toLocaleTimeString()} - {slot.endTime.toLocaleTimeString()}</td>
                                        <td>{slot.course.name}</td>
                                        <td>{slot.classLocation.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {classData.students.map((student) => (
                                <li key={student.id}>
                                    <Link href={`/students/${student.id}`} className="text-blue-600 hover:underline">
                                        {student.firstName} {student.lastName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
