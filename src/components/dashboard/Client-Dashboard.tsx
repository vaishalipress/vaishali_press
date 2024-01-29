"use client";
import { DistrictPage } from "@/components/dashboard/district";
import { Filter } from "../filter";
import { useClientDashboardInfo } from "@/hooks/use-fetch-data";
import { LoadingCells } from "../loading";
import { Table, TableBody } from "../ui/table";

export const ClientDashboard = () => {
    const { data, isLoading } = useClientDashboardInfo();
    return (
        <div>
            <div className="flex justify-between mb-3 items-center">
                <h1 className="text-base lg:text-xl uppercase  font-semibold">
                    Clients
                </h1>
                <Filter />
            </div>
            {isLoading && (
                <div>
                    <Table>
                        <TableBody>
                            <LoadingCells />
                        </TableBody>
                    </Table>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {data?.map((district) => (
                    <DistrictPage key={district._id} {...district} />
                ))}
            </div>
        </div>
    );
};
