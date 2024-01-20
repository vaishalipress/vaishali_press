"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";

interface Props {
    setOpen?: (value: boolean) => void;
    className?: string;
    dashboardIcon?: boolean;
}

export const IsAuth: FC<Props> = ({
    setOpen,
    className,
    dashboardIcon = true,
}) => {
    const { status } = useSession();
    const isAuth = status === "authenticated" ? true : false;

    return isAuth ? (
        <Link
            className={cn(
                "text-sm font-semibold leading-6 text-gray-900 flex gap-1 items-center justify-center",
                className
            )}
            href={"/dashboard"}
            onClick={() => !!setOpen && setOpen(!open)}
        >
            {dashboardIcon && <LayoutDashboard className="w-4 h-4" />}
            <span>Dashbord</span>
        </Link>
    ) : (
        <Link
            className={cn(
                "text-sm font-semibold leading-6 text-gray-900",
                className
            )}
            href={"/login"}
            onClick={() => !!setOpen && setOpen(!open)}
        >
            Log in <span aria-hidden="true">&rarr;</span>
        </Link>
    );
};
