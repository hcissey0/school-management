import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

async function getCourse(id: string) {
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            department: true,
            teacher: {
                include: {
                    user: true
                }
            },
            timetable: {
                include: {
                    class: true,
                    classLocation: true
                }
            }
        },
    })

    if (!course) {
        notFound()
    }

    return course
}

export default async function CourseProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        return <div>You do not have permission to view this page.</div>
    }

    const course = await getCourse(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Course Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Course Name:</span>
                            <span>{course.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Course Code:</span>
                            <span>{course.code}</span>
                        </div>
                        <div>
                            <span className="font-medium">Credits:</span>
                            <span>{course.credits}</span>
                        </div>
                        <div>
                            <span className="font-medium">Department:</span>
                            <Link href={`/departments/${course.department.id}`} className="text-blue-600 hover:underline">
                                {course.department.name}
                            </Link>
                        </div>
                        <div>
                            <span className="font-medium">Teacher:</span>
                            <Link href={`/staff/${course.teacher.id}`} className="text-blue-600 hover:underline">
                                {course.teacher.firstName} {course.teacher.lastName}
                            </Link>
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
                                    <th>Class</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {course.timetable.map((slot) => (
                                    <tr key={slot.id}>
                                        <td>{slot.dayOfWeek}</td>
                                        <td>{slot.startTime.toLocaleTimeString()} - {slot.endTime.toLocaleTimeString()}</td>
                                        <td>
                                            <Link href={`/classes/${slot.class.id}`} className="text-blue-600 hover:underline">
                                                {slot.class.name}
                                            </Link>
                                        </td>
                                        <td>{slot.classLocation.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
