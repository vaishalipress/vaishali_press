"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { FC } from "react";
import Link from "next/link";

interface NavigationItemProps {
    name: string;
    Icon: React.ReactNode;
    link: string;
}

export const SidebarItem: FC<NavigationItemProps> = ({ link, name, Icon }) => {
    const pathName = usePathname();
    const paths = pathName.split("/");

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <Link href={link} className="group relative flex items-center">
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[5px]",
                        paths[paths.length - 1] === name.toLowerCase()
                            ? "h-[36px]"
                            : "h-[8px] group-hover:h-[20px]"
                    )}
                />

                <div
                    className={cn(
                        "relative group flex items-center bg-primary/10 justify-center mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden ",
                        paths[paths.length - 1] === name.toLowerCase() &&
                            "bg-primary/10 text-primary rounded-[16px]"
                    )}
                >
                    {Icon}
                </div>
            </Link>
        </ActionTooltip>
    );
};
