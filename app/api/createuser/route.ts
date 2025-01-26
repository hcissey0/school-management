import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {

  const body = await request.json();
  const { name, email, password, role } = body;
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
  });

  return NextResponse.json({user:newUser}, { status: 201 });
}
