

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  Users,
  UserPlus,
  Bell,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function MainSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN";
  const isStaff = session?.user?.role === "STAFF";
  const isStudent = session?.user?.role === "STUDENT";

  const menuItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    {
      href: "/classes",
      icon: BookOpen,
      label: "Classes",
      roles: ["ADMIN", "TEACHER"],
    },
    {
      href: "/students",
      icon: GraduationCap,
      label: "Students",
      roles: ["ADMIN", "TEACHER"],
    },
    { href: "/staff", icon: Users, label: "Staff", roles: ["ADMIN"] },
    {
      href: "/timetable",
      icon: Calendar,
      label: "Timetable",
      roles: ["ADMIN", "TEACHER"],
    },
    {
      href: "/attendance",
      icon: ClipboardList,
      label: "Attendance",
      roles: ["ADMIN", "TEACHER"],
    },
    { href: "/announcements", icon: Bell, label: "Announcements" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold">School Management</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(
                (item) =>
                  (!item.roles || item.roles.includes(session?.user?.role as string)) && (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
