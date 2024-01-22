import {
    BaggageClaim,
    Box,
    FormInput,
    LayoutDashboard,
    Album,
    BookUser,
    Boxes,
    Home,
    Users,
} from "lucide-react";

export const navigation = [
    { name: "Home", href: "/", Icon: Home },
    { name: "Product", href: "/product", Icon: Boxes },
    { name: "About", href: "/about", Icon: Album },
    { name: "Contact", href: "/contact", Icon: BookUser },
];

export const DashboardLinks = [
    {
        link: "/",
        name: "Home",
        Icon: <Home className="text-indigo-700 dark:text-slate-600" />,
    },
    {
        link: "/dashboard",
        name: "Dashboard",
        Icon: (
            <LayoutDashboard className="text-orange-800 dark:text-indigo-500" />
        ),
    },
    {
        link: "/dashboard/clients",
        name: "Clients",
        Icon: <Users className="text-slate-600 dark:text-rose-600" />,
    },
    {
        link: "/dashboard/products",
        name: "Products",
        Icon: <Box className="text-red-700 dark:text-orange-600" />,
    },
    {
        link: "/dashboard/sales",
        name: "Sales",
        Icon: <BaggageClaim className="text-gray-700 dark:text-yellow-500" />,
    },
    {
        link: "/dashboard/password",
        name: "Password",
        Icon: <FormInput className="text-neutral-600 dark:text-green-600" />,
    },
];
