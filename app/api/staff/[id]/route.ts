import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staff = await prisma.staff.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!staff) {
    return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  }

  return NextResponse.json(staff);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, role } = body;

  try {
    const updatedStaff = await prisma.staff.update({
      where: { id: params.id },
      data: {
        role,
        user: {
          update: {
            name,
            email,
          },
        },
      },
      include: { user: true },
    });

    return NextResponse.json(updatedStaff);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating staff" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.staff.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Staff deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting staff" },
      { status: 500 }
    );
  }
}
