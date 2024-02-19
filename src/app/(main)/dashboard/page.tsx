import ClientStats from "@/components/clients/clientStats";
import ProductStats from "@/components/product/productStats";

export default async function DashboardPage() {
    return (
        <div className="w-full  max-w-[1390px] m-auto h-full py-3">
            <div className="flex flex-wrap gap-5">
                <ProductStats />
                <ClientStats />
            </div>
        </div>
    );
}
