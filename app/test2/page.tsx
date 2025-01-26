import { auth } from "@/lib/auth"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  const studentsCount = await prisma.student.count();
  const classesCount = await prisma.class.count();
  const staffCount = await prisma.staff.count();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{studentsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{classesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{staffCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
