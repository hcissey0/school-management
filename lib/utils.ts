import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "./prisma";
import { Book, BookOpen, Building, Building2, DoorOpen, GraduationCap, IconNode, Layers, PieChart, School, UserPlus, Users } from "lucide-react";
import React from "react";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function getInitials(str: string) {
  return capitalize(str).split(" ").map(a => a.charAt(0)).join("");
}

export async function getStats() {
  const studentsCount = await prisma.student.count();
  const classesCount = await prisma.class.count();
  const staffCount = await prisma.staff.count();
  const coursesCount = await prisma.course.count();
  const departmentsCount = await prisma.department.count();

  const upcomingEvents = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
  });

}



export function getId(role: "ADMIN" | "STAFF" | "STUDENT", roleCount: number): string {
  // Generate a unique ID based on role and roleCount
  // For admin, the ID starts with 0, for staff, the ID starts with 1, and for student, the ID starts with 2
  // then followed by a 3 digit number
  // then the last 2 digits of the current year
  // ex: 000124, 100224, 200224
  const prefix = role === "ADMIN" ? "0" : role === "STAFF" ? "1" : "2";
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const id = `${prefix}${String(roleCount + 1).padStart(3, "0")}${currentYear}`;
  console.log(id);
  return id;

}

// with this function, when a user is deleted
// the loginId is not reused


export async function old_generateUniqueLoginId(role: "ADMIN" | "STAFF" | "STUDENT"): Promise<string> {
  let uniqueId: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    const roleCount = await prisma.user.count({ where: { role } });
    uniqueId = getId(role, roleCount);

    // Check if the loginId already exists
    const existingUser = await prisma.user.findUnique({
      where: { loginId: uniqueId }
    });

    if (!existingUser) {
      return uniqueId;
    } else {
      console.log(`Login ID ${uniqueId} already exists. Generating a new one...`);
      // generate a new loginId

      throw new Error(`Login ID ${uniqueId} already exists. Generating a new one...`);
    }

    attempts++;
  } while (attempts < maxAttempts);

  throw new Error(`Could not generate unique login ID after ${maxAttempts} attempts`);
}
// create a function that generates the loginId from the logic


// write a better generateUniqueLoginId function
// that generates a unique loginId based on the last user's loginId

// new_generateUniqueLoginId("STUDENT") => 200224
export async function generateUniqueLoginId(role: "ADMIN" | "STAFF" | "STUDENT"): Promise<string> {
  const lastUser = await prisma.user.findFirst({
    where: { role },
    orderBy: { createdAt: "desc" },
  });


  console.log("This run")
  if (!lastUser) {
    return getId(role, 0);
  }

  console.log("Reached here")

  const lastId = lastUser.loginId;
  let lastIdNumber = parseInt(lastId.slice(1, 4));

    // Increment the lastIdNumber until a unique loginId is found
    let newId;
    do {
      lastIdNumber++;
      newId = getId(role, lastIdNumber);
    } while (await prisma.user.findUnique({ where: { loginId: newId } }));

    return newId;
}

export function getNavData(role: "ADMIN" | "STAFF" | "STUDENT"): {
  title: string;
  url: string;
  icon: React.ComponentType;
  items?: {
    title: string;
    url: string;
  }[];
}[] | undefined {

  if (role === "ADMIN") {
    return [
      {
        title: "Dashboard",
        url: "/admin",
        icon: PieChart,
      },
      {
        title: "Students",
        url: "/admin/students",
        icon: Users,
        items: [
          {
            title: "Enrollment",
            url: "/admin/students/enrollment",
          },
          {
            title: "Attendance",
            url: "/admin/students/attendance",
          },
          {
            title: "Performance",
            url: "/admin/students/performance",
          },
        ],
      },
      {
        title: "Staff",
        url: "/admin/staff",
        icon: GraduationCap,
        items: [
          {
            title: "Add New Staff",
            url: "/admin/staff/add",
          },
          {
            title: "Directory",
            url: "/admin/staff/directory",
          },
          {
            title: "Evaluations",
            url: "/admin/staff/evaluations",
          }
        ]
      },
      {
        title: "Courses",
        url: "/admin/courses",
        icon: BookOpen,
      },
      {
        title: "Departments",
        url: "/admin/departments",
        icon: Building2,
      },
      {
        title: "Classes",
        url: "/admin/classes",
        icon: Layers,
      }
    ];
  }
  else if (role === "STAFF") {
    return [
      {
        title: "Dashboard",
        url: "/staff",
        icon: "Dashboard",
      },
      {
        title: "Classes",
        url: "/staff/classes",
        icon: "Classes",
      },
      {
        title: "Students",
        url: "/staff/students",
        icon: "Students",
      },
    ];
  }
  else if (role === "STUDENT") {
    return [
      {
        title: "Dashboard",
        url: "/student",
        icon: "Dashboard",
      },
      {
        title: "Classes",
        url: "/student/classes",
        icon: "Classes",
      },
    ];
  }

}
