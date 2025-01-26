import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


const session = await auth();

export default function Page() {

    if (session?.user.role !== "STUDENT") {
        return redirect('/');
    }

    return (
        <div>
            <h1>Students</h1>
        </div>
    );
}
