"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Logout = () => {
    return (
        <Button size={"icon"} variant={"outline"} onClick={() => signOut()}>
            <LogOut className="w-5 h-5 text-gray-700 dark:text-white" />
        </Button>
    );
};
