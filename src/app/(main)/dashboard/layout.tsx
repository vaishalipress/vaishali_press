import { ThemeProvider } from "@/components/providers/theme-provider";
import { SideBar } from "@/components/sidebar/sidebar";

export default function DashboardRoot({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="vaishaliTheme"
        >
            <div className="flex w-full h-full">
                <div className="min-h-screen h-screen sticky">
                    <SideBar />
                </div>
                <div className="w-full h-screen min-h-screen overflow-y-auto px-2 relative">
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
