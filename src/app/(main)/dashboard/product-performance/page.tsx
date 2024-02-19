import { DistrictPerformanceByProducts } from "@/components/dashboard/District-Performance-By-Products";
import { ProductPerformance } from "@/components/dashboard/Product-Performance";

export default async function ProductPerformancePage() {
    return (
        <div className="w-full  max-w-[1390px] m-auto h-full py-3">
            <ProductPerformance />

            <DistrictPerformanceByProducts />
        </div>
    );
}
