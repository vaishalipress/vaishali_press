"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { navigation } from "@/lib/constants";
import { IsAuth } from "@/components/navbar/isAuth";

const LinkStyle3 =
    "text-lg font-medium flex items-center gap-3 hover:bg-primary/10 px-3 py-3 rounded-md hover:underline";

const MobileNavBar = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden w-full flex justify-around py-5">
            <div className="flex items-center justify-center">
                <Image
                    priority
                    src="/logo.png"
                    width={50}
                    height={0}
                    alt="logo"
                    className="h-8 w-auto"
                />
            </div>
            <div className="flex gap-5 items-center justify-center">
                <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
                    <SheetTrigger asChild>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className="dark:bg-white py-5 px-3 drop-shadow-md"
                            suppressHydrationWarning
                        >
                            <Menu className="h-[1.2rem] w-[1.2rem] text-red-700" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side={"left"}
                        className="flex flex-col gap-0 pt-16 dark:bg-white dark:text-black"
                    >
                        <ScrollArea>
                            <div className="flex flex-col">
                                <IsAuth
                                    setOpen={setOpen}
                                    className={`${LinkStyle3} justify-start`}
                                />

                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={LinkStyle3}
                                        onClick={() => setOpen(!open)}
                                    >
                                        <item.Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default MobileNavBar;
