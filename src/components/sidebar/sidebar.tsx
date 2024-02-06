import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarItem } from "@/components/sidebar/sidebar-item";
import { ModeToggle } from "@/components/mode-toggle";
import { DashboardLinks } from "@/lib/constants";
import { SideBarLogo } from "@/components/sidebar/sidebar-logo";
import { Logout } from "../logout";

export const SideBar = async () => {
    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5EB] py-3">
            {/* Logo  */}
            <SideBarLogo />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

            {/* Links */}
            <ScrollArea className="flex-1 w-full">
                {DashboardLinks.map((link, idx) => (
                    <div key={idx} className="mb-4">
                        <SidebarItem
                            Icon={link.Icon}
                            name={link.name}
                            link={link.link}
                        />
                    </div>
                ))}
            </ScrollArea>

            {/* Theme and Logout */}
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <Logout />
            </div>
        </div>
    );
};
