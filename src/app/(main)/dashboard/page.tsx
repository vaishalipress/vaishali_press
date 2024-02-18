import ClientStats from "@/components/clients/clientStats";
import { DistrictPerformanceByClient } from "@/components/dashboard/District-Performance-By-Client";
import { DistrictPerformanceByProducts } from "@/components/dashboard/District-Performance-By-Products";
import { ProductDashboard } from "@/components/dashboard/Product-Dashboard";
import ProductStats from "@/components/product/productStats";

export default async function DashboardPage() {
    try {
        return (
            <div className="w-full  max-w-[1390px] m-auto h-full py-3">
                <div className="flex flex-wrap gap-5">
                    <ProductStats />
                    <ClientStats />
                </div>
                {/* Products */}

                <ProductDashboard />

                <DistrictPerformanceByClient />
                <DistrictPerformanceByProducts />
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
