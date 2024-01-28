import { DistrictPage } from "@/components/dashboard/district";
import { districtType } from "@/lib/types";
import axios from "axios";

export default async function Dashboard() {
    const { data } = await axios<districtType[]>(
        "http://localhost:3000/api/dashboard"
    );
    return (
        <div className="w-full h-full">
            <h1 className="text-xl uppercase">Clients</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {data?.map((district) => (
                    <DistrictPage key={district._id} {...district} />
                ))}
            </div>
        </div>
    );
}
