import {
    BaggageClaim,
    Box,
    Currency,
    Home,
    LayoutDashboard,
    Package,
    Shell,
    Users,
} from "lucide-react";
import Link from "next/link";
import { CustomToolTip } from "../custom-tooltip/ToolTip";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

const links = [
    {
        link: "/",
        content: "Home",
        Icon: <Home className="text-indigo-700" />,
    },
    {
        link: "/dashboard",
        content: "Dashboard",
        Icon: <LayoutDashboard className="text-orange-800" />,
    },
    {
        link: "/clients",
        content: "Clients",
        Icon: <Users className="text-slate-600" />,
    },
    {
        link: "/products",
        content: "Products",
        Icon: <Box className="text-red-700" />,
    },
    {
        link: "/sales",
        content: "Sales",
        Icon: <BaggageClaim className="text-gray-700" />,
    },
];

export const SideBar = () => {
    return (
        <div className="space-y-4 flex flex-col items-center min-h-screen h-full text-primary w-full max-w-[60px] dark:bg-[#1E1F22] bg-[#E3E5EB] py-3">
            <div className="relative bg-black w-12 h-[43px] rounded-lg flex items-center justify-center">
                <Image
                    fill
                    src={"/logo.png"}
                    className="object-contain"
                    alt="logo"
                />
            </div>
            <ScrollArea>
                {links.map((link, idx) => (
                    <CustomToolTip key={idx} content={link.content}>
                        <div className="flex w-full justify-center items-center relative mb-4 group">
                            <div className="absolute left-0 w-[4px] bg-zinc-600 h-[8px] rounded-r-full group-hover:h-[36px] transition-all" />
                            <div
                                className={`px-[10px] py-[10px] bg-zinc-100 rounded-[24px] hover:rounded-[15px] transition-all`}
                            >
                                {link.Icon}
                            </div>
                        </div>
                    </CustomToolTip>
                ))}
            </ScrollArea>
        </div>
    );
};
