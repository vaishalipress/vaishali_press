"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MONTHS } from "@/lib/constants";
import dynamic from "next/dynamic";
import { BarChart, PieChart, TableIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Chart = dynamic(() => import("@/components/charts/Chart"), {
    ssr: false,
});

type ViewType = "bar" | "pie" | "table";
type AnalysisType = "year-month-market" | "year-market-month" | "combined";
type GroupBy = "market" | "district";

interface MarketMonthData {
    month?: number;
    targetValue?: number;
    actualSales?: number;
    achievementPercentage?: number | null;
}

interface MarketData {
    marketId?: string;
    marketName?: string;
    district?: string;
    months?: MarketMonthData[];
    yearlyTarget?: number;
    yearlySales?: number;
    yearlyAchievement?: number | null;
}

interface YearData {
    year?: number;
    markets?: MarketData[];
    overallYearlyTarget?: number;
    overallYearlySales?: number;
    overallYearlyAchievement?: number | null;
}

interface CombinedData {
    marketId?: string;
    marketName?: string;
    district?: string;
    targetValue?: number;
    actualSales?: number;
    achievementPercentage?: number | null;
    count?: number;
}

interface YearMonthMarketData {
    year?: number;
    yearlyTarget?: number;
    yearlySales?: number;
    yearlyAchievement?: number | null;
    months?: {
        month?: number;
        monthlyTarget?: number;
        monthlySales?: number;
        monthlyAchievement?: number | null;
        groups?: {
            marketId?: string;
            marketName?: string;
            district?: string;
            targetValue?: number;
            actualSales?: number;
            achievementPercentage?: number | null;
        }[];
    }[];
}

interface ApiResponse {
    success?: boolean;
    results?: YearData[] | CombinedData[] | YearMonthMarketData[];
    type?: string;
    years?: number[];
}

export default function TargetAnalysisPage() {
    const [view, setView] = useState<ViewType>("table");
    const [analysisType, setAnalysisType] =
        useState<AnalysisType>("year-month-market");
    const [groupBy, setGroupBy] = useState<GroupBy>("market");
    const [startYear, setStartYear] = useState<string>("all");
    const [endYear, setEndYear] = useState<string>("all");
    const [month, setMonth] = useState<string>("all");
    const [district, setDistrict] = useState<string>("all");

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: [
            "target-analysis",
            analysisType,
            groupBy,
            startYear,
            endYear,
            month,
            district,
        ],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("type", analysisType);
            params.append("groupBy", groupBy);

            if (startYear !== "all") params.append("startYear", startYear);
            if (endYear !== "all") params.append("endYear", endYear);
            if (month !== "all") params.append("month", month);
            if (district !== "all") params.append("district", district);

            const res = await axios.get(`/api/target/analysis?${params}`);
            return res.data;
        },
    });

    const formatPercentage = (value: number | null | undefined) => {
        if (value === null || value === undefined) return "-";
        return `${value.toFixed(2)}%`;
    };

    const renderYearMonthMarketView = (data: YearMonthMarketData[] = []) => {
        return (
            <div className="space-y-8">
                {data?.map((yearData) => (
                    <div key={yearData?.year} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Year: {yearData?.year} | Overall Achievement:{" "}
                            {formatPercentage(yearData?.yearlyAchievement)}
                        </h3>

                        <div className="space-y-6">
                            {yearData?.months?.map((monthData) => (
                                <div
                                    key={monthData?.month}
                                    className="ml-4 border-l pl-4"
                                >
                                    <h4 className="font-medium">
                                        {monthData?.month !== undefined
                                            ? MONTHS[monthData.month]
                                            : "All"}{" "}
                                        | Monthly Achievement:{" "}
                                        {formatPercentage(
                                            monthData?.monthlyAchievement
                                        )}
                                    </h4>

                                    <Table className="mt-2">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    {groupBy === "market"
                                                        ? "Market"
                                                        : "District"}
                                                </TableHead>
                                                <TableHead>Target</TableHead>
                                                <TableHead>Sales</TableHead>
                                                <TableHead>
                                                    Achievement
                                                </TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {monthData?.groups?.map(
                                                (group) => (
                                                    <TableRow
                                                        key={
                                                            group?.marketId ??
                                                            group?.district
                                                        }
                                                    >
                                                        <TableCell>
                                                            {groupBy === "market"
                                                                ? group?.marketName
                                                                : group?.district}
                                                        </TableCell>
                                                        <TableCell>
                                                            {group?.targetValue ??
                                                                "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {group?.actualSales ??
                                                                "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatPercentage(
                                                                group?.achievementPercentage
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    (group?.actualSales ??
                                                                        0) >=
                                                                    (group?.targetValue ??
                                                                        0)
                                                                        ? "default"
                                                                        : "destructive"
                                                                }
                                                            >
                                                                {(group?.actualSales ??
                                                                    0) >=
                                                                (group?.targetValue ??
                                                                    0)
                                                                    ? "✅ Achieved"
                                                                    : "❌ Pending"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderYearMarketMonthView = (data: YearData[] = []) => {
        return (
            <div className="space-y-8">
                {data?.map((yearData) => (
                    <div key={yearData?.year} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Year: {yearData?.year} | Overall Achievement:{" "}
                            {formatPercentage(
                                yearData?.overallYearlyAchievement
                            )}
                        </h3>

                        {view === "table" ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {groupBy === "market"
                                                ? "Market"
                                                : "District"}
                                        </TableHead>
                                        {MONTHS.map((month, idx) => (
                                            <TableHead key={idx}>
                                                {month}
                                            </TableHead>
                                        ))}
                                        <TableHead>Year Total</TableHead>
                                        <TableHead>Achievement</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {yearData?.markets?.map((market) => (
                                        <TableRow key={market?.marketId}>
                                            <TableCell>
                                                {groupBy === "market"
                                                    ? market?.marketName
                                                    : market?.district}
                                            </TableCell>
                                            {MONTHS.map((_, idx) => {
                                                const monthData =
                                                    market?.months?.find(
                                                        (m) => m?.month === idx
                                                    );
                                                return (
                                                    <TableCell key={idx}>
                                                        {monthData ? (
                                                            <>
                                                                <div>
                                                                    {monthData?.actualSales ??
                                                                        "-"}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {monthData?.targetValue ??
                                                                        "-"}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <div>
                                                    {market?.yearlySales ?? "-"}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {market?.yearlyTarget ??
                                                        "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        (market?.yearlyAchievement ??
                                                            0) >= 100
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {formatPercentage(
                                                        market?.yearlyAchievement
                                                    )}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Chart
                                type={view}
                                data={
                                    yearData?.markets?.flatMap(
                                        (market) =>
                                            market?.months?.map((month) => ({
                                                name: `${
                                                    groupBy === "market"
                                                        ? market?.marketName
                                                        : market?.district
                                                } - ${
                                                    MONTHS[month?.month ?? 0]
                                                }`,
                                                target: month?.targetValue ?? 0,
                                                sales: month?.actualSales ?? 0,
                                            })) ?? []
                                    ) ?? []
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderCombinedView = (data: CombinedData[] = []) => {
        return (
            <div className="space-y-4">
                {view === "table" ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {groupBy === "market" ? "Market" : "District"}
                                </TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Sales</TableHead>
                                <TableHead>Achievement</TableHead>
                                <TableHead>Status</TableHead>
                                {groupBy === "district" && (
                                    <TableHead>Count</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        {groupBy === "market"
                                            ? item?.marketName
                                            : item?.district}
                                    </TableCell>
                                    <TableCell>
                                        {item?.targetValue ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {item?.actualSales ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {formatPercentage(
                                            item?.achievementPercentage
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                (item?.actualSales ?? 0) >=
                                                (item?.targetValue ?? 0)
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {(item?.actualSales ?? 0) >=
                                            (item?.targetValue ?? 0)
                                                ? "✅ Achieved"
                                                : "❌ Pending"}
                                        </Badge>
                                    </TableCell>
                                    {groupBy === "district" && (
                                        <TableCell>{item?.count ?? "-"}</TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Chart
                        type={view}
                        data={
                            data?.map((item) => ({
                                name:
                                    groupBy === "market"
                                        ? item?.marketName ?? ""
                                        : item?.district ?? "",
                                target: item?.targetValue ?? 0,
                                sales: item?.actualSales ?? 0,
                            })) ?? []
                        }
                    />
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            );
        }

        if (error) {
            return <div>Error loading data</div>;
        }

        if (!data?.results || data.results.length === 0) {
            return <div>No data available</div>;
        }

        switch (analysisType) {
            case "year-month-market":
                return renderYearMonthMarketView(
                    data.results as YearMonthMarketData[]
                );
            case "year-market-month":
                return renderYearMarketMonthView(data.results as YearData[]);
            case "combined":
                return renderCombinedView(data.results as CombinedData[]);
            default:
                return <div>Invalid view type</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">
                📈 Target Analysis Dashboard
            </h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <Select
                    value={analysisType}
                    onValueChange={(val) =>
                        setAnalysisType(val as AnalysisType)
                    }
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Analysis Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="year-month-market">
                            Year > Month > Market
                        </SelectItem>
                        <SelectItem value="year-market-month">
                            Year > Market > Month
                        </SelectItem>
                        <SelectItem value="combined">Combined View</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={groupBy}
                    onValueChange={(val) => setGroupBy(val as GroupBy)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Group By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="district">District</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Start Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {data?.years?.map((year) => (
                            <SelectItem value={year?.toString()} key={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="End Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {data?.years?.map((year) => (
                            <SelectItem value={year?.toString()} key={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        {MONTHS.map((m, i) => (
                            <SelectItem key={i} value={i.toString()}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <button
                        onClick={() => setView("table")}
                        className={`p-2 rounded ${
                            view === "table" ? "bg-gray-200" : ""
                        }`}
                        title="Table View"
                    >
                        <TableIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setView("bar")}
                        className={`p-2 rounded ${
                            view === "bar" ? "bg-gray-200" : ""
                        }`}
                        title="Bar Chart"
                    >
                        <BarChart className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setView("pie")}
                        className={`p-2 rounded ${
                            view === "pie" ? "bg-gray-200" : ""
                        }`}
                        title="Pie Chart"
                    >
                        <PieChart className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
                {renderContent()}
            </div>
        </div>
    );
}