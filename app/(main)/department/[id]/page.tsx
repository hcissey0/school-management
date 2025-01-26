import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

async function getDepartment(id: string) {
    const department = await prisma.department.findUnique({
        where: { id },
        include: {
            classes: true,
            courses: true,
            staff: {
                include: {
                    user: true
                }
            }
        },
    })

    if (!department) {
        notFound()
    }

    return department
}

export default async function DepartmentProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        return <div>You do not have permission to view this page.</div>
    }

    const department = await getDepartment(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Department Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Department Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Department Name:</span>
                            <span>{department.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Department ID:</span>
                            <span>{department.ID}</span>
                        </div>
                        <div>
                            <span className="font-medium">Number of Classes:</span>
                            <span>{department.classes.length}</span>
                        </div>
                        <div>
                            <span className="font-medium">Number of Courses:</span>
                            <span>{department.courses.length}</span>
                        </div>
                        <div>
                            <span className="font-medium">Number of Staff:</span>
                            <span>{department.staff.length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {department.classes.map((cls) => (
                                <li key={cls.id}>
                                    <Link href={`/classes/${cls.id}`} className="text-blue-600 hover:underline">
                                        {cls.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {department.courses.map((course) => (
                                <li key={course.id}>
                                    <Link href={`/courses/${course.id}`} className="text-blue-600 hover:underline">
                                        {course.name} ({course.code})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {department.staff.map((staff) => (
                                <li key={staff.id}>
                                    <Link href={`/staff/${staff.id}`} className="text-blue-600 hover:underline">
                                        {staff.firstName} {staff.lastName} - {staff.role}
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
