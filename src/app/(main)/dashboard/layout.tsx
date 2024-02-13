import ModalProvider from "@/components/providers/modal-provider";
import QueryProvider from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SideBar } from "@/components/sidebar/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardRoot({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <QueryProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            storageKey="vaishaliTheme"
        >
            <div className="flex w-screen h-full">
                <div className="min-h-screen h-screen sticky z-50">
                    <SideBar />
                </div>
                <div className="w-full h-screen min-h-screen overflow-y-auto px-2 relative">
                    {children}
                </div>
                <Toaster />
                <ModalProvider />
            </div>
        </ThemeProvider>
        // </QueryProvider>
    );
}
