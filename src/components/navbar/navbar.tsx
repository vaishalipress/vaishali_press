import Image from "next/image";
import Link from "next/link";
import MobileNavBar from "./mobile";
import { navigation } from "@/lib/constants";
import { IsAuth } from "./isAuth";

export const Navbar = () => {
    return (
        <header className="relative z-50">
            <nav
                className="hidden lg:flex items-center justify-between p-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Vaishali press</span>
                        <Image
                            className="h-8 w-auto drop-shadow-2xl"
                            src={"/logo.png"}
                            width={100}
                            height={100}
                            alt="logo"
                        />
                    </Link>
                </div>

                <div className="flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="flex lg:flex-1 lg:justify-end">
                    <IsAuth dashboardIcon={false} />
                </div>
            </nav>
            <MobileNavBar />
        </header>
    );
};
