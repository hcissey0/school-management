

import React from "react";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  ChevronsUpDown,
  Clipboard,
  GraduationCap,
  Library,
  LifeBuoy,
  LogOut,
  Mail,
  MoreHorizontal,
  PieChart,
  School,
  Send,
  Settings,
  Users,
  UserCircle,
  ChevronDown,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeSwitch } from "../theme-switch";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import LogoutButton from "../logout-button";
import { getId, getNavData } from "@/lib/utils";
import BreadcrumbNav from "../breadcrumbnav";
import { Button } from "../ui/button";


export async function SidebarLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = (await session)?.user
  
  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";
  const isStudent = user?.role === "STUDENT";
  
  const adminNav = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: PieChart,
    },
    {
      title: "Students",
      url: "",
      icon: Users,
      items: [
        { title: "Enrollment", url: "/admin/students/enrollment" },
        { title: "Attendance", url: "/admin/students/attendance" },
        { title: "Performance", url: "/admin/students/performance" },
      ],
    },
    {
      title: "Teachers",
      url: "#",
      icon: GraduationCap,
      items: [
        { title: "Directory", url: "/admin/teachers/directory" },
        { title: "Schedules", url: "/admin/teachers/schedules" },
        { title: "Evaluations", url: "/admin/teachers/evaluations" },
      ],
    },
    {
      title: "Courses",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Course Catalog", url: "/admin/courses/catalog" },
        { title: "Schedules", url: "/admin/courses/schedules" },
        { title: "Grades", url: "/admin/courses/grades" },
      ],
    },
    {
      title: "Calendar",
      url: "/admin/calendar",
      icon: Calendar,
    },
    {
      title: "Library",
      url: "/admin/library",
      icon: Library,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: Clipboard,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        { title: "General", url: "/admin/settings/general" },
        { title: "Notifications", url: "/admin/settings/notifications" },
        { title: "Security", url: "/admin/settings/security" },
      ],
    },
  ]
  
  // write the nav for staff and student
  
  
  const staffNav = [
    {
      title: "Dashboard",
      url: "/staff",
      icon: PieChart,
    }
  ];
  const studentNav = [
    {
      title: "Dashboard",
      url: "/student",
      icon: PieChart,
    }
  ];
  
  let mainNav;
  if (isAdmin)
    mainNav = adminNav;
  else if (isStaff)
    mainNav = staffNav;
  else if (isStudent)
    mainNav = studentNav;
  
  const data = {
    user: user,
    navMain: getNavData(user?.role as "ADMIN" | "STAFF" | "STUDENT"),
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      },
    ],
    quickAccess: isAdmin ? [
      {
        name: "Student Portal",
        url: "/test/student-portal",
        icon: UserCircle,
      },
      {
        name: "Parent Portal",
        url: "/test/parent-portal",
        icon: Users,
      },
      {
        name: "Staff Portal",
        url: "/test/staff-portal",
        icon: GraduationCap,
      },
    ]: undefined,
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                {/* <div>
                </div> */}
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-700 text-sidebar-primary-foreground">
                    <School className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">EduManage</span>
                    <span className="truncate text-xs">
                      School Management System
                    </span>
                  </div>
                </Link>

              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Main Menu
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
            <SidebarMenu>
              {data?.navMain?.map((item) => (
                <Collapsible key={item.title} asChild>
                  <SidebarMenuItem>
                    {/* <CollapsibleTrigger asChild>
                    </CollapsibleTrigger> */}
                    <SidebarMenuButton asChild tooltip={item.title}>

                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
              </CollapsibleContent>
          </SidebarGroup>
              </Collapsible>
          <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
            Quick Access
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
            <SidebarMenu>
              {data?.quickAccess?.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
          </Collapsible>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user?.image as string}
                        alt={data.user?.name as string}
                      />
                      <AvatarFallback className="rounded-lg text-lg font-bold">{data.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user?.image as string}
                          alt={data.user?.name as string}
                        />
                        <AvatarFallback className="rounded-lg text-lg font-bold">
                          {data.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className=" font-semibold">
                          {data.user?.name} • {data.user?.loginId}
                        </span>
                        <span className="truncate text-xs">
                          {data.user?.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                        <Link href="/profile">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                        </Link>
                        <Link href='/inbox'>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Inbox</span>
                    </DropdownMenuItem>
                        
                        </Link>
                        <Link href='/settings'>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                        
                        </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    "use server"
                    await signOut()
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />

                    <span>Log out</span>
                  </DropdownMenuItem>
                  {/* <LogoutButton /> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbNav />
          </div>
          <div className="ml-auto flex items-center gap-4 px-4">
            <Badge variant="outline" className="hidden md:inline-flex">
              <Calendar className="mr-1 h-3 w-3" />
              Academic Year 2023-2024
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    3
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New student enrollment</DropdownMenuItem>
                <DropdownMenuItem>Upcoming staff meeting</DropdownMenuItem>
                <DropdownMenuItem>Grade submission deadline</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeSwitch />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
