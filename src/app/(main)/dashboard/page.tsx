import ClientStats from "@/components/dashboard/clientStats";
import DashboardCards from "@/components/dashboard/cards";
import ProductStats from "@/components/dashboard/productStats";

export default async function DashboardPage() {
    return (
        <div className="w-full  max-w-[1390px] m-auto h-full py-3 mb-7">
            <DashboardCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProductStats />
                <ClientStats />
            </div>
        </div>
    );
}
