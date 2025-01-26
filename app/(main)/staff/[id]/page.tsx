import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getStaff(id: string) {
    const staff = await prisma.staff.findUnique({
        where: { id },
        include: {
            user: true,
            department: true,
            classes: true,
            courses: true,
        },
    })

    if (!staff) {
        notFound()
    }

    return staff
}

export default async function StaffProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return <div>You do not have permission to view this page.</div>
    }

    const staff = await getStaff(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Staff Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${staff.firstName} ${staff.lastName}`} alt={`${staff.firstName} ${staff.lastName}`} />
                                <AvatarFallback>{staff.firstName[0]}{staff.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-semibold">{staff.firstName} {staff.lastName}</h2>
                                <p className="text-gray-500">{staff.user.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="font-medium">Date of Birth:</span>
                                <span>{staff.DOB}</span>
                            </div>
                            <div>
                                <span className="font-medium">Gender:</span>
                                <span>{staff.gender}</span>
                            </div>
                            <div>
                                <span className="font-medium">Address:</span>
                                <span>{staff.address}, {staff.town}</span>
                            </div>
                            <div>
                                <span className="font-medium">Phone:</span>
                                <span>{staff.phoneNumber}</span>
                            </div>
                            <div>
                                <span className="font-medium">Languages:</span>
                                <span>{staff.languagesSpoken.join(', ')}</span>
                            </div>
                            <div>
                                <span className="font-medium">Marital Status:</span>
                                <span>{staff.maritalStatus}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Employment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Staff ID:</span>
                            <span>{staff.ID}</span>
                        </div>
                        <div>
                            <span className="font-medium">Role:</span>
                            <Badge variant="outline">{staff.role}</Badge>
                        </div>
                        <div>
                            <span className="font-medium">Position:</span>
                            <span>{staff.position || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="font-medium">Department:</span>
                            <span>{staff.department.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Hire Date:</span>
                            <span>{new Date(staff.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Health Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Health Status:</span>
                            <Badge variant="outline">{staff.healthStatus}</Badge>
                        </div>
                        <div>
                            <span className="font-medium">Prevalent Disability:</span>
                            <span>{staff.prevalentDisability}</span>
                        </div>
                        <div>
                            <span className="font-medium">Medical Info:</span>
                            <span>{staff.medicalInfo}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Classes and Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Classes</h3>
                            <ul className="list-disc list-inside">
                                {staff.classes.map(cls => (
                                    <li key={cls.id}>{cls.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold">Courses</h3>
                            <ul className="list-disc list-inside">
                                {staff.courses.map(course => (
                                    <li key={course.id}>{course.name} ({course.code})</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
