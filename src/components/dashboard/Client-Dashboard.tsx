"use client";
import {
    BadgeIndianRupee,
    BaggageClaim,
    Cuboid,
    IndianRupee,
    User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Info } from "@/components/infoWithTooltip";
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
        <div className="w-full max-w-5xl border rounded-md px-3 py-3 flex flex-col gap-3">
            {/* District sction */}
            <div className="flex gap-3 justify-between w-full py-2">
                <Badge
                    variant={"destructive"}
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
            <>
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
            </>
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
        <div className="grid grid-cols-2 gap-1 lg:flex lg:gap-2 flex-wrap">
            {/* Block */}
            <Info
                toolTip="market"
                Icon={Cuboid}
                count={totalMarket}
                className="text-indigo-600"
            />

            {/* Client */}
            <Info
                toolTip="Clients"
                Icon={User}
                count={totalClient}
                className="text-orange-800"
            />

            {/* Sales */}
            <Info
                toolTip="sales"
                Icon={BaggageClaim}
                count={totalSale}
                className="text-amber-800 "
            />

            {/* Amount */}
            <Info
                toolTip="Amount"
                Icon={BadgeIndianRupee}
                count={totalAmount}
                className="text-green-800  "
            />
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
        <div className="w-full border rounded-md px-3 py-2">
            <div className="flex w-full gap-3 justify-between items-center py-3 overflow-x-auto">
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
            <div className="flex-1 w-full">
                <Clients clients={clients} />
            </div>
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
        <div className="flex gap-2 items-center lg:gap-4 flex-wrap">
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
                    <IndianRupee className="w-3 h-3"/>
                    {totalAmount}
                </span>
            </div>
        </div>
    );
};
