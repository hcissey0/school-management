import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const staff = await prisma.staff.findMany({
    include: { user: true },
  });

  const staffData = staff.map((s) => ({
    id: s.id,
    name: s.user.name,
    email: s.user.email,
    role: s.role,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button asChild>
          <Link href="/staff/new">Add New Staff</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={staffData} />
    </div>
  );
}
