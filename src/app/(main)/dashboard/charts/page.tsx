"use client";
import Chart from "@/components/performance/Chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientPerformanceStats } from "@/hooks/use-fetch-data";
import { useFilterDate } from "@/hooks/useFilterDate";
import { useMemo, useState } from "react";

export default function ChartWrapper() {
    const N = 10;

    const { date, setDate, toggleType, type } = useFilterDate();
    const { data: clientsData, isLoading } = useClientPerformanceStats(date);
    const [showAll, setShowAll] = useState(false);
    const [search, setSearch] = useState("");

    // 🔁 Filter + sort + slice data
    const chartData = useMemo(() => {
        const filtered = clientsData
            ?.filter((item) =>
                item.client.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => ({
                name: item.client.name,
                value: item.totalQty,
            }))
            .sort((a, b) => b.value - a.value);

        const finalData = showAll ? filtered : filtered?.slice(0, N);

        return finalData?.map((entry, index) => ({
            ...entry,
            name: `${index + 1}. ${entry.name}`, // Add rank prefix
        }));
    }, [search, showAll]);

    return (
        <div className="space-y-4">
            <div className="flex">
                {/* 🔍 Search */}
                <Input
                    type="text"
                    placeholder="Search client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* 🔁 Toggle */}
                <Button
                    onClick={() => setShowAll((prev) => !prev)}
                    variant={"secondary"}
                    className="ml-2"
                >
                    {showAll ? "Show Top 10" : "Show All"}
                </Button>
            </div>

            {/* 📊 Chart */}
            <Chart type="bar" data={chartData || []} />
        </div>
    );
}
