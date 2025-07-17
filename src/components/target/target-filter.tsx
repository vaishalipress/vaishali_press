"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { MONTHS } from "@/lib/constants";
import { useMarket } from "@/hooks/use-fetch-data";

interface Props {
    market: string;
    setMarket: (value: string) => void;
    month: string;
    setMonth: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    page: number;
    setPage: (page: number) => void;
    view: number;
    setView: (view: number) => void;
    years: number[];
}

export const FilterTarget = ({
    market,
    setMarket,
    month,
    setMonth,
    year,
    setYear,
    page,
    setPage,
    view,
    setView,
    years,
}: Props) => {
    const { data: marketData, isLoading: isMarketLoading } = useMarket("all");

    const onChangeView = (val: string) => {
        setView(Number(val));
        setPage(1);
    };

    return (
        <div className="flex flex-wrap sm:flex-nowrap w-full max-w-7xl gap-2 overflow-x-auto px-1">
            {/* Market */}
            <Select value={market} onValueChange={setMarket}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                    {isMarketLoading ? (
                        <SelectGroup>
                            <SelectLabel className="text-center">
                                <Loader2 className="animate-spin" />
                            </SelectLabel>
                        </SelectGroup>
                    ) : (
                        <>
                            <SelectGroup>
                                <SelectLabel>Markets</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                            </SelectGroup>

                            {/* Grouping manually */}
                            {Object.entries(
                                (() => {
                                    const grouped: Record<
                                        string,
                                        typeof marketData
                                    > = {};
                                    marketData?.forEach((mkt) => {
                                        const district =
                                            mkt.district || "Unknown";
                                        if (!grouped?.[district]) {
                                            grouped[district] = [];
                                        }
                                        grouped?.[district]?.push(mkt);
                                    });
                                    return grouped;
                                })()
                            )?.map(([district, markets]) => (
                                <SelectGroup key={district}>
                                    <SelectLabel className="uppercase">
                                        {district}
                                    </SelectLabel>
                                    {markets?.map((mkt) => (
                                        <SelectItem
                                            key={mkt._id}
                                            value={mkt._id}
                                        >
                                            {mkt.name.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>

            {/* Month */}
            <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        <SelectItem value="all">All</SelectItem>
                        {MONTHS.map((m, idx) => (
                            <SelectItem key={idx} value={idx.toString()}>
                                {m.toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Year */}
            <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Year</SelectLabel>
                        <SelectItem value="all">All</SelectItem>
                        {years.map((yr) => (
                            <SelectItem key={yr} value={yr.toString()}>
                                {yr}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* View */}
            <Select value={view.toString()} onValueChange={onChangeView}>
                <SelectTrigger>
                    <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Per Page</SelectLabel>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
