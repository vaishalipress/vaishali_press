import { ClientPerformance } from "@/components/dashboard/Client-Performance";
import { DistrictPerformanceByClient } from "@/components/dashboard/District-Performance-By-Client";

export default async function ClientPerformancePage() {
    return (
        <div className="w-full  max-w-[1390px] m-auto h-full py-3">
            <ClientPerformance />
            <DistrictPerformanceByClient />
        </div>
    );
}
