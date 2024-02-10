import ClientStats from "@/components/clients/clientStats";
import { ClientDashboard } from "@/components/dashboard/Client-Dashboard";
import { ProductDashboard } from "@/components/dashboard/Product-Dashboard";
import ProductStats from "@/components/product/productStats";

export default async function DashboardPage() {
    try {
        return (
            <div className="w-full h-full py-3">
                <div className="flex flex-wrap gap-5">
                    <ProductStats />
                    <ClientStats />
                </div>
                {/* Products */}

                <ProductDashboard />

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
