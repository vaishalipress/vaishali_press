"use client";
import { IndianRupee } from "lucide-react";
import { DistrictStatsInPerformance } from "@/lib/types";
import { Clients } from "@/components/performance/client-table";
import { EachMarketTypeInDistrict } from "@/lib/types";
import { useDistrictPerformanceByClient } from "@/hooks/use-fetch-data";
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
import { Input } from "../ui/input";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

export const DistrictPerformanceByClient = () => {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data: districtData, isLoading } =
        useDistrictPerformanceByClient(date);

    const [data, setData] = useState<DistrictStatsInPerformance[] | undefined>(
        []
    );
    const [search, setSearch] = useState("");
    let timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setData(districtData);
    }, [districtData]);

    const searchClientByName = useCallback(
        (name: string) => {
            if (!districtData) return;
            const searchedClient = [...districtData].filter((dist) =>
                dist?.district?.startsWith(name?.toLowerCase())
            );
            setData(searchedClient);
        },
        [districtData]
    );

    const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            searchClientByName(e.target.value);
        }, 300);
    };

    return (
        <div className="w-full pb-2 min-h-96">
            <div className="flex justify-between mb-2 items-center gap-2 bg-slate-200 dark:bg-slate-700 py-3 px-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase font-semibold">
                    District Performance By Client
                </h1>
                <Filter
                    date={date}
                    setDate={setDate}
                    type={type}
                    toggleType={toggleType}
                    isLoading={isLoading}
                    download={false}
                >
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => searchHandler(e)}
                    />
                </Filter>
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
                {data?.map((district, idx) => (
                    <DistrictPage
                        key={district?._id}
                        idx={idx + 1}
                        {...district}
                    />
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
    idx,
}: DistrictStatsInPerformance & { idx: number }) => {
    return (
        <AccordionItem
            value={district}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            {/* District sction */}
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex items-center gap-2 w-[93%] justify-between">
                    <span className="text-sm font-medium  dark:text-zinc-200 uppercase">
                        {idx}. {district}
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
                            key={market?.market}
                            market={market?.market}
                            totalAmount={market?.totalAmount}
                            totalClient={market?.totalClient}
                            totalSale={market?.totalSale}
                            clients={market?.clients}
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
}: EachMarketTypeInDistrict) => {
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
