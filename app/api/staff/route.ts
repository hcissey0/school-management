import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staff = await prisma.staff.findMany({
    include: { user: true },
  });

  return NextResponse.json(staff);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, password, role } = body;
  console.log({body})

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(newUser)

    const newStaff = await prisma.staff.create({
      data: {
        userId: newUser.id,
        role,
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating staff" },
      { status: 500 }
    );
  }
}
