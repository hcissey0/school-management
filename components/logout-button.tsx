"use client";
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function LogoutButton() {
    return (
        <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />

            <span>Log out</span>
        </DropdownMenuItem>
    );
}
