import { ClientDashboard } from "@/components/dashboard/Client-Dashboard";
import { ProductDashboard } from "@/components/dashboard/Product-Dashboard";

export default async function DashboardPage() {
    try {
        return (
            <div className="w-full h-full">
                {/* Products */}
                <div className="mb-3 py-3">
                    <h1 className="text-base mb-3 lg:text-xl uppercase font-semibold">
                        Products
                    </h1>
                    <ProductDashboard />
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
