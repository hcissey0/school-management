import { notFound } from 'next/navigation'

import { auth, authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getStudent(id: string) {
    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            user: true,
            class: true,
        },
    })

    if (!student) {
        notFound()
    }

    return student
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session) {
        return <div>Please sign in to view this page.</div>
    }

    const student = await getStudent(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Student Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.firstName} ${student.lastName}`} alt={`${student.firstName} ${student.lastName}`} />
                                <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-semibold">{student.firstName} {student.lastName}</h2>
                                <p className="text-gray-500">{student.user.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="font-medium">Date of Birth:</span>
                                <span>{new Date(student.DOB).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="font-medium">Gender:</span>
                                <span>{student.gender}</span>
                            </div>
                            <div>
                                <span className="font-medium">Address:</span>
                                <span>{student.address}, {student.town}</span>
                            </div>
                            <div>
                                <span className="font-medium">Phone:</span>
                                <span>{student.phoneNumber || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium">Tribe:</span>
                                <span>{student.tribe}</span>
                            </div>
                            <div>
                                <span className="font-medium">Languages:</span>
                                <span>{student.languagesSpoken.join(', ')}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Academic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Student ID:</span>
                            <span>{student.ID}</span>
                        </div>
                        <div>
                            <span className="font-medium">Class:</span>
                            <span>{student.class?.name || 'Not Assigned'}</span>
                        </div>
                        <div>
                            <span className="font-medium">Enrollment Date:</span>
                            <span>{new Date(student.createdAt).toLocaleDateString()}</span>
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
                            <Badge variant="outline">{student.healthStatus}</Badge>
                        </div>
                        <div>
                            <span className="font-medium">Prevalent Disability:</span>
                            <span>{student.prevalentDisability}</span>
                        </div>
                        <div>
                            <span className="font-medium">Medical Info:</span>
                            <span>{student.medicalInfo || 'None'}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Guardian Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Mother</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div><span className="font-medium">Name:</span> {student.mothersName}</div>
                                <div><span className="font-medium">Phone:</span> {student.mothersPhone}</div>
                                <div><span className="font-medium">Email:</span> {student.mothersEmail || 'N/A'}</div>
                                <div><span className="font-medium">Occupation:</span> {student.mothersOccupation}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold">Father</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div><span className="font-medium">Name:</span> {student.fathersName}</div>
                                <div><span className="font-medium">Phone:</span> {student.fathersPhone}</div>
                                <div><span className="font-medium">Email:</span> {student.fathersEmail || 'N/A'}</div>
                                <div><span className="font-medium">Occupation:</span> {student.fathersOccupation}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold">Guardian</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div><span className="font-medium">Name:</span> {student.guardiansName}</div>
                                <div><span className="font-medium">Phone:</span> {student.guardiansPhone}</div>
                                <div><span className="font-medium">Email:</span> {student.guardiansEmail || 'N/A'}</div>
                                <div><span className="font-medium">Occupation:</span> {student.guardiansOccupation}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
