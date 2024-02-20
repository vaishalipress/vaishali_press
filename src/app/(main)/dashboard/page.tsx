import ClientStats from "@/components/dashboard/clientStats";
import DashboardCards from "@/components/dashboard/cards";
import ProductStats from "@/components/dashboard/productStats";

export default async function DashboardPage() {
    return (
        <div className="w-full  max-w-[1390px] m-auto h-full py-3 mb-7">
            <DashboardCards />
            <div className="flex justify-center flex-wrap gap-5">
                <ProductStats />
                <ClientStats />
            </div>
        </div>
    );
}
