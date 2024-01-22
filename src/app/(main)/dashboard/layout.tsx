import { SideBar } from "@/components/sidebar/sidebar";

export default function DashboardRoot({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full h-full">
            <SideBar />
            <div className="w-full">{children}</div>
        </div>
    );
}
