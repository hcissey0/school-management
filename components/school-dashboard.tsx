"use client";

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

const data = {
  user: {
    name: "John Doe",
    email: "john.doe@school.edu",
    avatar: "/avatars/john-doe.jpg",
    role: "Administrator",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Students",
      url: "#",
      icon: Users,
      items: [
        { title: "Enrollment", url: "#" },
        { title: "Attendance", url: "#" },
        { title: "Performance", url: "#" },
      ],
    },
    {
      title: "Teachers",
      url: "#",
      icon: GraduationCap,
      items: [
        { title: "Directory", url: "#" },
        { title: "Schedules", url: "#" },
        { title: "Evaluations", url: "#" },
      ],
    },
    {
      title: "Courses",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Course Catalog", url: "#" },
        { title: "Schedules", url: "#" },
        { title: "Grades", url: "#" },
      ],
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Library",
      url: "#",
      icon: Library,
    },
    {
      title: "Reports",
      url: "#",
      icon: Clipboard,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        { title: "General", url: "#" },
        { title: "Notifications", url: "#" },
        { title: "Security", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  quickAccess: [
    {
      name: "Student Portal",
      url: "#",
      icon: UserCircle,
    },
    {
      name: "Parent Portal",
      url: "#",
      icon: Users,
    },
    {
      name: "Staff Portal",
      url: "#",
      icon: GraduationCap,
    },
  ],
};

export default function SchoolDashboard() {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <School className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">EduManage</span>
                    <span className="truncate text-xs">
                      School Management System
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
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
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
            <SidebarMenu>
              {data.quickAccess.map((item) => (
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
          </SidebarGroup>
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
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
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
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Inbox</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">Total Students</h3>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground">
                +5.2% from last month
              </p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">Total Teachers</h3>
              <div className="text-3xl font-bold">98</div>
              <p className="text-sm text-muted-foreground">
                +2.1% from last month
              </p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">Average Attendance</h3>
              <div className="text-3xl font-bold">92.7%</div>
              <p className="text-sm text-muted-foreground">
                -0.5% from last week
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">Upcoming Events</h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>Parent-Teacher Conference</span>
                  <span className="text-sm text-muted-foreground">Mar 15</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Science Fair</span>
                  <span className="text-sm text-muted-foreground">Apr 2</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>End of Term Exams</span>
                  <span className="text-sm text-muted-foreground">
                    May 10-20
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">
                Recent Announcements
              </h3>
              <ul className="space-y-2">
                <li>New COVID-19 guidelines for campus</li>
                <li>Library extended hours for exam week</li>
                <li>Online portal maintenance scheduled</li>
              </ul>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Add New Student
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Create Announcement
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
