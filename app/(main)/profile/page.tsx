
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            student: true,
            staff: true,
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export default async function UserProfilePage() {
    const session = await auth();

    if (!session) {
        return <div>Please sign in to view your profile.</div>
    }

    const user = await getUserProfile(session.user.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.image || `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                <AvatarFallback>{user.name ? user.name[0] : 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-semibold">{user.name}</h2>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <div>
                            <span className="font-medium">Login ID:</span>
                            <span>{user.loginId}</span>
                        </div>
                        <div>
                            <span className="font-medium">Role:</span>
                            <Badge variant="outline">{user.role}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {user.student && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">Student ID:</span>
                                <span>{user.student.ID}</span>
                            </div>
                            <div>
                                <span className="font-medium">Class:</span>
                                <span>{user.student.class?.name || 'Not Assigned'}</span>
                            </div>
                            <div>
                                <span className="font-medium">Enrollment Date:</span>
                                <span>{new Date(user.student.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {user.staff && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Staff Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">Staff ID:</span>
                                <span>{user.staff.ID}</span>
                            </div>
                            <div>
                                <span className="font-medium">Position:</span>
                                <span>{user.staff.position || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium">Department:</span>
                                <span>{user.staff.department.name}</span>
                            </div>
                            <div>
                                <span className="font-medium">Hire Date:</span>
                                <span>{new Date(user.staff.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
