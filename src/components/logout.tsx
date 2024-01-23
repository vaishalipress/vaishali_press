"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Logout = () => {
    return (
        <Button
            className="bg-transparent bottom-0"
            variant="outline"
            size="icon"
            onClick={() => signOut()}
        >
            <LogOut className="w-4 h-4 text-gray-700 dark:text-white" />
        </Button>
    );
};
