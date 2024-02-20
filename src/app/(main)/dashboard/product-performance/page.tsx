import { DistrictPerformanceByProducts } from "@/components/performance/District-Performance-By-Products";
import { ProductPerformance } from "@/components/performance/Product-Performance";

export default async function ProductPerformancePage() {
    return (
        <div className="w-full  max-w-[1390px] m-auto h-full py-3">
            <ProductPerformance />

            <DistrictPerformanceByProducts />
        </div>
    );
}
