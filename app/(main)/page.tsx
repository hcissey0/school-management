import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";



export default async function Home() {
    const session = await auth();
    
    const isAdmin = session?.user?.role === "ADMIN";
    const isStaff = session?.user?.role === "STAFF";
    const isStudent = session?.user?.role === "STUDENT";

    if (isAdmin) return redirect('/admin');
    if (isStaff) return redirect('/staff');
    if (isStudent) return redirect('/student');

    return redirect('/auth/signin');
}
