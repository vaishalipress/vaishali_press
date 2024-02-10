"use client";
import { IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { districtType } from "@/lib/types";
import { Clients } from "@/components/dashboard/client-table";
import { MarketTypeInDashboard } from "@/lib/types";
import { useClientDashboardInfo } from "@/hooks/use-fetch-data";
import { LoadingCells } from "@/components/loading";
import { Table, TableBody } from "@/components/ui/table";

export const ClientDashboard = () => {
    const { data, isLoading } = useClientDashboardInfo();
    return (
        <div>
            <div className="flex justify-between mb-3 items-center">
                <h1 className="text-base lg:text-xl uppercase  font-semibold">
                    Clients
                </h1>
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
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-3"> */}
            <div className="w-full flex flex-wrap gap-2">
                {data?.map((district) => (
                    <DistrictPage key={district._id} {...district} />
                ))}
            </div>
        </div>
    );
};

export const DistrictPage = ({
    district,
    totalAmount,
    totalClient,
    totalSale,
    markets,
    totalMarket,
}: districtType) => {
    return (
        <div className="w-full h-fit border rounded-md px-3 py-3 flex flex-col gap-3">
            {/* District sction */}
            <div className="flex gap-3 justify-between w-full py-2">
                <Badge
                    variant={"secondary"}
                    className="h-8 text-sm lg:text-base font-medium  dark:text-zinc-200 uppercase"
                >
                    {district}
                </Badge>
                <DistrictHeaderInfo
                    totalAmount={totalAmount}
                    totalMarket={totalMarket}
                    totalClient={totalClient}
                    totalSale={totalSale}
                />
            </div>
            <div className="flex gap-2 flex-wrap">
                {markets?.map((market) => (
                    <MarketSection
                        key={market.market}
                        market={market.market}
                        totalAmount={market.totalAmount}
                        totalClient={market.totalClient}
                        totalSale={market.totalSale}
                        clients={market.clients}
                    />
                ))}
            </div>
        </div>
    );
};

const DistrictHeaderInfo = ({
    totalAmount = 0,
    totalMarket = 0,
    totalClient = 0,
    totalSale = 0,
}: {
    totalMarket: number;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
}) => {
    return (
        <div className="flex gap-2 items-center sm:gap-4 overflow-x-auto w-fit no-scrollbar">
            {/* <div className="grid grid-cols-2 gap-1 md:flex md:gap-2 flex-wrap"> */}
            {/* Block */}

            <div className="flex flex-row gap-2 items-center text-xs uppercase">
                <span className="font-medium">Market</span>
                <span className="font-medium">{totalMarket}</span>
            </div>

            {/* Client */}
            <div className="flex flex-row gap-2 items-center text-xs uppercase">
                <span className="font-medium">Client</span>
                <span className="font-medium">{totalClient}</span>
            </div>

            {/* Sales */}
            <div className="flex flex-row gap-2 items-center text-xs uppercase">
                <span className="font-medium">Sale</span>
                <span className="font-medium">{totalSale}</span>
            </div>

            {/* Amount */}

            <div className="flex flex-row gap-2 items-center text-xs uppercase">
                <span className="font-medium">Amount</span>
                <span className="font-medium flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {totalAmount}
                </span>
            </div>
        </div>
    );
};

export const MarketSection = ({
    market,
    totalAmount,
    totalClient,
    totalSale,
    clients,
}: MarketTypeInDashboard) => {
    return (
        <div className="w-full border rounded-md px-3 py-2 max-w-md">
            <div className="flex w-full gap-3 justify-between items-center py-3">
                <span className="font-medium capitalize text-sm px-3">
                    {market}
                </span>
                <MarketHeaderInfo
                    totalAmount={totalAmount}
                    totalClient={totalClient}
                    totalSale={totalSale}
                />
            </div>
            {/* Client */}
            <Clients clients={clients} />
        </div>
    );
};

const MarketHeaderInfo = ({
    totalAmount,
    totalClient,
    totalSale,
}: {
    totalClient: number;
    totalSale: number;
    totalAmount: number;
}) => {
    return (
        <div className="flex gap-2 items-center sm:gap-4 overflow-x-auto w-fit no-scrollbar">
            {/* Client */}
            <div className="flex gap-2 flex-row items-center text-xs uppercase">
                <span>Client</span>
                <span className="font-medium">{totalClient}</span>
            </div>

            {/* Sales */}
            <div className="flex flex-row gap-2 items-center text-xs uppercase">
                <span>sale</span>
                <span className="font-medium">{totalSale}</span>
            </div>

            {/* Amount */}
            <div className="flex flex-row gap-2 items-center text-xs uppercase">
                <span>Amount</span>
                <span className="font-medium flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {totalAmount}
                </span>
            </div>
        </div>
    );
};
