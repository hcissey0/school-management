// export { auth as middleware } from "@/lib/auth";

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: Request) {
    const session = await auth();
    const path = new URL(request.url).pathname;

    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (session && path.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Public paths that don't require authentication
    const publicPaths = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // Check if user is authenticated
    if (!session) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Role-based access control
    const userRole = session.user?.role;

    // Admin only routes
    if (path.startsWith("/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Staff only routes
    if (path.startsWith("/staff") && userRole !== "STAFF" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Student only routes
    if (path.startsWith("/student") && userRole !== "STUDENT" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes
         */
        "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
    ],
};
