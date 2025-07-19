"use client";
import { Filter } from "@/components/filter";
import Chart from "@/components/performance/Chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    useClientPerformanceStats,
    useDistrictPerformanceByProducts,
} from "@/hooks/use-fetch-data";
import { useFilterDate } from "@/hooks/useFilterDate";
import { useMemo, useState } from "react";

const N = 20;
function ClientPerformance() {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data: clientsData, isLoading } = useClientPerformanceStats(date, [
        "65b91e25c8aeefd5b6171ca1",
        "65b91da3f46eaa0c8bd42667",
    ]);

    const [showAll, setShowAll] = useState(false);
    const [search, setSearch] = useState("");

    // 🔁 Filter + sort + slice data
    const chartData = useMemo(() => {
        // First sort all data by totalQty to establish rankings
        const sortedData = clientsData
            ?.map((item, index) => ({
                ...item,
                originalIndex: index, // Store original position
            }))
            .sort((a, b) => b.totalQty - a.totalQty);

        // Then filter based on search
        const filtered = sortedData
            ?.filter((item) =>
                item.client.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => ({
                name: item.client.name,
                value: item.totalQty,
                originalRank:
                    sortedData.findIndex(
                        (i) => i.client._id === item.client._id
                    ) + 1, // Get the original rank (1-based)
            }));

        const finalData = showAll ? filtered : filtered?.slice(0, N);

        return finalData?.map((entry) => ({
            ...entry,
            name: `${entry.originalRank}. ${entry.name}`, // Use original rank
        }));
    }, [search, showAll, clientsData]);

    return (
        <div className="space-y-4 py-2">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase font-semibold">
                    Client Performance
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
                        type="text"
                        placeholder="Search client..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={isLoading}
                        className="min-w-16"
                    />

                    {/* 🔁 Toggle */}
                    <Button
                        onClick={() => setShowAll((prev) => !prev)}
                        variant={"secondary"}
                        className="ml-2"
                        disabled={isLoading}
                    >
                        {showAll ? "Show Top 10" : "Show All"}
                    </Button>
                </Filter>
            </div>

            {/* 📊 Chart */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading client data...
                    </p>
                </div>
            ) : chartData?.length ? (
                <Chart type="bar" data={chartData} />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <p className="text-slate-600 dark:text-slate-300">
                        {search
                            ? "No clients match your search"
                            : "No client data available"}
                    </p>
                </div>
            )}
        </div>
    );
}

function DistrictPerformance() {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data: clientsData, isLoading } = useDistrictPerformanceByProducts(
        date,
        ["65b91e25c8aeefd5b6171ca1", "65b91da3f46eaa0c8bd42667"]
    );

    const [showAll, setShowAll] = useState(false);
    const [search, setSearch] = useState("");

    // 🔁 Filter + sort + slice data
    const chartData = useMemo(() => {
        // First sort all districts by totalQtySold to establish original rankings
        const sortedDistricts = clientsData
            ?.slice() // Create a copy to avoid mutating original
            .sort((a, b) => b.totalQtySold - a.totalQtySold)
            .map((district, index) => ({
                ...district,
                originalRank: index + 1, // Store original ranking (1-based)
            }));

        // Then filter based on search while preserving original rankings
        const filtered = sortedDistricts
            ?.filter((item) =>
                item.district.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => ({
                name: item.district,
                value: item.totalQtySold,
                originalRank: item.originalRank, // Preserve original rank
            }));

        const finalData = showAll ? filtered : filtered?.slice(0, N);

        return finalData?.map((entry) => ({
            ...entry,
            name: `${entry.originalRank}. ${entry.name}`, // Use original rank
        }));
    }, [search, showAll, clientsData]);

    return (
        <div className="space-y-4 py-2">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase font-semibold">
                    District Performance
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
                        type="text"
                        placeholder="Search district..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={isLoading}
                        className="min-w-16"
                    />

                    {/* 🔁 Toggle */}
                    <Button
                        onClick={() => setShowAll((prev) => !prev)}
                        variant={"secondary"}
                        className="ml-2"
                        disabled={isLoading}
                    >
                        {showAll ? "Show Top 10" : "Show All"}
                    </Button>
                </Filter>
            </div>

            {/* 📊 Chart */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading client data...
                    </p>
                </div>
            ) : chartData?.length ? (
                <Chart type="bar" data={chartData} />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <p className="text-slate-600 dark:text-slate-300">
                        {search
                            ? "No clients match your search"
                            : "No client data available"}
                    </p>
                </div>
            )}
        </div>
    );
}
function MarketPerformance() {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data: clientsData, isLoading } = useDistrictPerformanceByProducts(
        date,
        ["65b91e25c8aeefd5b6171ca1", "65b91da3f46eaa0c8bd42667"]
    );

    const [showAll, setShowAll] = useState(false);
    const [search, setSearch] = useState("");

    // 🔁 Filter + sort + slice data
    const chartData = useMemo(() => {
        // First flatten all markets and establish original rankings
        const allMarkets = clientsData
            ?.flatMap((d) =>
                d.markets.map((m) => ({
                    ...m,
                    name: `${m.name} (${d.district})`, // Combine market and district
                }))
            )
            ?.sort((a, b) => b.totalQtySold - a.totalQtySold)
            .map((market, index) => ({
                ...market,
                originalRank: index + 1, // Store original ranking (1-based)
            }));

        // Then filter based on search while preserving original rankings
        const filtered = allMarkets
            ?.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            )
            ?.map((item) => ({
                name: item.name,
                value: item.totalQtySold,
                originalRank: item.originalRank, // Preserve original rank
            }));

        const finalData = showAll ? filtered : filtered?.slice(0, N);

        return finalData?.map((entry) => ({
            ...entry,
            name: `${entry.originalRank}. ${entry.name}`, // Use original rank
        }));
    }, [search, showAll, clientsData]);

    return (
        <div className="space-y-4 py-2">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase font-semibold">
                    Market Performance
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
                        type="text"
                        placeholder="Search market..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={isLoading}
                        className="min-w-16"
                    />

                    {/* 🔁 Toggle */}
                    <Button
                        onClick={() => setShowAll((prev) => !prev)}
                        variant={"secondary"}
                        className="ml-2"
                        disabled={isLoading}
                    >
                        {showAll ? "Show Top 10" : "Show All"}
                    </Button>
                </Filter>
            </div>

            {/* 📊 Chart */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading client data...
                    </p>
                </div>
            ) : chartData?.length ? (
                <Chart type="bar" data={chartData} />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <p className="text-slate-600 dark:text-slate-300">
                        {search
                            ? "No clients match your search"
                            : "No client data available"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ChartsPage() {
    return (
        <div>
            <ClientPerformance />
            <DistrictPerformance />
            <MarketPerformance />
        </div>
    );
}
