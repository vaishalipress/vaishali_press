import { ClientDashboard } from "@/components/dashboard/Client-Dashboard";

export default async function DashboardPage() {
    try {
        return (
            <div className="w-full h-full">
                {/* Products */}
                <div className="mb-3">
                    <h1 className="text-base lg:text-xl uppercase font-semibold">
                        Products
                    </h1>
                    <div>Making</div>
                </div>

                <ClientDashboard />
            </div>
        );
    } catch (error) {
        console.log(error);
        return (
            <div>
                <h1>some Error</h1>
            </div>
        );
    }
}
