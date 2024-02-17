"use client";
import { IndianRupee } from "lucide-react";
import { districtType } from "@/lib/types";
import { Clients } from "@/components/dashboard/client-table";
import { MarketTypeInDashboard } from "@/lib/types";
import { useClientDashboardInfo } from "@/hooks/use-fetch-data";
import { LoadingCells } from "@/components/loading";
import { Table, TableBody } from "@/components/ui/table";
import { Filter } from "@/components/filter";
import { useFilterDate } from "@/hooks/useFilterDate";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const DistrictDashboard = () => {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useClientDashboardInfo(date);
    return (
        <div className="w-full">
            <div className="flex justify-between mb-2 items-center gap-2 bg-zinc-300 py-3 px-3 rounded-md">
                <h1 className="text-sm lg:text-xl uppercase  font-semibold text-orange-900">
                    District Performance
                </h1>

                <Filter
                    date={date}
                    setDate={setDate}
                    type={type}
                    toggleType={toggleType}
                    isLoading={isLoading}
                    download={false}
                />
            </div>
            {isLoading && (
                <div>
                    <Table>
                        <TableBody>
                            <LoadingCells rows={5} />
                        </TableBody>
                    </Table>
                </div>
            )}
            <Accordion type="multiple" className="w-full">
                {data?.map((district) => (
                    <DistrictPage key={district._id} {...district} />
                ))}
            </Accordion>
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
        <AccordionItem
            value={district}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            {/* District sction */}
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex items-center gap-2 w-[93%] justify-between">
                    <span className="text-sm lg:text-base font-medium  dark:text-zinc-200 uppercase">
                        {district}
                    </span>
                    <DistrictHeaderInfo
                        totalAmount={totalAmount}
                        totalMarket={totalMarket}
                        totalClient={totalClient}
                        totalSale={totalSale}
                    />
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex gap-2 flex-wrap px-3">
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
            </AccordionContent>
        </AccordionItem>
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
        <div className="w-full  max-h-96  overflow-y-auto border rounded-md  max-w-md relative">
            <div className="flex w-full gap-3 justify-between items-center px-3 py-3 sticky top-0 bg-orange-300 z-20 dark:bg-orange-900">
                <span className="font-medium capitalize text-sm">{market}</span>
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
