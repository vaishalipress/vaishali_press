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
import { BarChart, IndianRupee, PieChart, TableIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "./component/multi-select";
import { useProduct } from "@/hooks/use-fetch-data";

const Chart = dynamic(() => import("@/components/charts/Chart"), {
    ssr: false,
});

type ViewType = "bar" | "pie" | "table";
type AnalysisType = "year-month-market" | "year-market-month" | "combined";
type GroupBy = "market" | "district";

interface MarketMonthData {
    month?: number;
    targetQty?: number;
    targetSale?: number;
    actualQty?: number;
    actualSales?: number;
    salesAchievementPercentage?: number | null;
    qtyAchievementPercentage?: number | null;
}

interface MarketData {
    marketId?: string;
    marketName?: string;
    district?: string;
    months?: MarketMonthData[];
    yearlyTargetQty?: number;
    yearlyTargetSale?: number;
    yearlyQty?: number;
    yearlySales?: number;
    yearlySalesAchievement?: number | null;
    yearlyQtyAchievement?: number | null;
}

interface YearData {
    year?: number;
    markets?: MarketData[];
    overallYearlyTargetQty?: number;
    overallYearlyTargetSale?: number;
    overallYearlyQty?: number;
    overallYearlySales?: number;
    overallYearlySalesAchievement?: number | null;
    overallYearlyQtyAchievement?: number | null;
    months?: {
        month?: number;
        monthlyTargetQty?: number;
        monthlyTargetSale?: number;
        monthlyQty?: number;
        monthlySales?: number;
        monthlySalesAchievement?: number | null;
        monthlyQtyAchievement?: number | null;
        groups?: {
            marketId?: string;
            marketName?: string;
            district?: string;
            targetQty?: number;
            targetSale?: number;
            actualQty?: number;
            actualSales?: number;
            salesAchievementPercentage?: number | null;
            qtyAchievementPercentage?: number | null;
        }[];
    }[];
}

interface CombinedData {
    marketId?: string;
    marketName?: string;
    district?: string;
    targetQty?: number;
    targetSale?: number;
    actualQty?: number;
    actualSales?: number;
    salesAchievementPercentage?: number | null;
    qtyAchievementPercentage?: number | null;
    count?: number;
}

interface YearMonthMarketData {
    year?: number;
    yearlyTargetQty?: number;
    yearlyTargetSale?: number;
    yearlyQty?: number;
    yearlySales?: number;
    yearlySalesAchievement?: number | null;
    yearlyQtyAchievement?: number | null;
    months?: {
        month?: number;
        monthlyTargetQty?: number;
        monthlyTargetSale?: number;
        monthlyQty?: number;
        monthlySales?: number;
        monthlySalesAchievement?: number | null;
        monthlyQtyAchievement?: number | null;
        groups?: {
            marketId?: string;
            marketName?: string;
            district?: string;
            targetQty?: number;
            targetSale?: number;
            actualQty?: number;
            actualSales?: number;
            salesAchievementPercentage?: number | null;
            qtyAchievementPercentage?: number | null;
        }[];
    }[];
}

interface ApiResponse {
    success?: boolean;
    results?: YearData[] | CombinedData[] | YearMonthMarketData[];
    type?: string;
    years?: number[];
    districts?: string[];
    markets?: { id: string; name: string }[];
}

export default function TargetAnalysisPage() {
    const [view, setView] = useState<ViewType>("table");
    const [analysisType, setAnalysisType] =
        useState<AnalysisType>("year-month-market");
    const [groupBy, setGroupBy] = useState<GroupBy>("market");
    const [startYear, setStartYear] = useState<string>("all");
    const [endYear, setEndYear] = useState<string>("all");
    const [month, setMonth] = useState<string>("all");
    const [selectedMarket, setSelectedMarket] = useState<string[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
    const { data: productData } = useProduct();

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: [
            "target-analysis",
            analysisType,
            groupBy,
            startYear,
            endYear,
            month,
            groupBy === "market" ? selectedMarket : selectedDistrict,
            selectedProduct,
        ],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("type", analysisType);
            params.append("groupBy", groupBy);

            if (startYear !== "all") params.append("startYear", startYear);
            if (endYear !== "all") params.append("endYear", endYear);
            if (month !== "all") params.append("month", month);
            if (groupBy === "market" && selectedMarket.length > 0)
                params.append("marketIds", selectedMarket.join(","));
            if (groupBy === "district" && selectedDistrict.length > 0)
                params.append("districts", selectedDistrict.join(","));
            if (selectedProduct.length > 0)
                params.append("productIds", selectedProduct.join(","));

            const res = await axios.get(`/api/target/analysis?${params}`);
            return res.data;
        },
    });

    const formatPercentage = (value: number | null | undefined) => {
        if (value === null || value === undefined) return "-";
        return `${value.toFixed(2)}%`;
    };

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return "-";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const renderYearMonthMarketView = (data: YearMonthMarketData[] = []) => {
        return (
            <div className="space-y-8">
                {data?.map((yearData) => (
                    <div key={yearData?.year} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Year: {yearData?.year} | Sold Achievement:{" "}
                            {formatPercentage(yearData?.yearlyQtyAchievement)} |
                            Sales Achievement:{" "}
                            {formatPercentage(yearData?.yearlySalesAchievement)}{" "}
                            | Total Qty: {yearData?.yearlyQty ?? "-"} | Total
                            Sales: {formatCurrency(yearData?.yearlySales)}
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
                                        | Monthly Sold Achievement:{" "}
                                        {formatPercentage(
                                            monthData?.monthlyQtyAchievement
                                        )}{" "}
                                        | Monthly Sales Achievement:{" "}
                                        {formatPercentage(
                                            monthData?.monthlySalesAchievement
                                        )}{" "}
                                        | Monthly Qty:{" "}
                                        {monthData?.monthlyQty ?? "-"} | Monthly
                                        Sales:{" "}
                                        {formatCurrency(
                                            monthData?.monthlySales
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
                                                <TableHead>
                                                    Target Qty
                                                </TableHead>
                                                <TableHead>
                                                    Target Sale
                                                </TableHead>
                                                <TableHead>Sold Qty</TableHead>
                                                <TableHead>Sells</TableHead>
                                                <TableHead>
                                                    Achievement - Sold - Sales
                                                </TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {monthData?.groups?.map((group) => (
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
                                                        {group?.targetQty ??
                                                            "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {group?.targetSale ??
                                                            "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {group?.actualQty ??
                                                            "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(
                                                            group?.actualSales
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatPercentage(
                                                            group?.qtyAchievementPercentage
                                                        )}{" "}
                                                        -{" "}
                                                        {formatPercentage(
                                                            group?.salesAchievementPercentage
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                (group?.actualQty ??
                                                                    0) >=
                                                                (group?.targetQty ??
                                                                    0)
                                                                    ? "default"
                                                                    : "destructive"
                                                            }
                                                        >
                                                            {(group?.actualQty ??
                                                                0) >=
                                                            (group?.targetQty ??
                                                                0)
                                                                ? "✅ Achieved"
                                                                : "❌ Pending"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
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
                            Sold Achievement:{" "}
                            {formatPercentage(
                                yearData?.overallYearlyQtyAchievement
                            )}{" "}
                            | Sales Achievement:{" "}
                            {formatPercentage(
                                yearData?.overallYearlySalesAchievement
                            )}{" "}
                            | Total Qty: {yearData?.overallYearlyQty ?? "-"} |
                            Total Sales:{" "}
                            {formatCurrency(yearData?.overallYearlySales)}
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
                                        <TableHead className="text-nowrap">
                                            Year Total
                                        </TableHead>
                                        <TableHead className="text-nowrap min-w-28">
                                            Achievement - Sold - Sales
                                        </TableHead>
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
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-nowrap">
                                                                    Qty:{" "}
                                                                    {monthData?.actualQty ??
                                                                        "-"}
                                                                </span>
                                                                <span className="text-xs text-nowrap">
                                                                    Sales:{" "}
                                                                    {formatCurrency(
                                                                        monthData?.actualSales
                                                                    )}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground text-nowrap">
                                                                    Target Qty:{" "}
                                                                    {monthData?.targetQty ??
                                                                        "-"}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground text-nowrap">
                                                                    Target Sale:{" "}
                                                                    <IndianRupee className="w-3 h-3 inline-block" />
                                                                    {monthData?.targetSale ??
                                                                        "-"}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell className="flex flex-col w-fit">
                                                <span className="text-xs text-nowrap">
                                                    Qty:{" "}
                                                    {market?.yearlyQty ?? "-"}
                                                </span>
                                                <span className="text-xs text-nowrap">
                                                    Sales:{" "}
                                                    {formatCurrency(
                                                        market?.yearlySales
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    Target:{" "}
                                                    {market?.yearlyTargetQty ??
                                                        "-"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="space-x-2 w-fi">
                                                <Badge
                                                    variant={
                                                        (market?.yearlyQtyAchievement ??
                                                            0) >= 100
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {formatPercentage(
                                                        market?.yearlyQtyAchievement
                                                    )}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        (market?.yearlySalesAchievement ??
                                                            0) >= 100
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {formatPercentage(
                                                        market?.yearlySalesAchievement
                                                    )}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-center font-medium mb-2">
                                        Quantity
                                    </h4>
                                    <Chart
                                        type={view}
                                        data={
                                            yearData?.markets?.flatMap(
                                                (market) =>
                                                    market?.months?.map(
                                                        (month) => ({
                                                            name: `${
                                                                groupBy ===
                                                                "market"
                                                                    ? market?.marketName
                                                                    : market?.district
                                                            } - ${
                                                                MONTHS[
                                                                    month?.month ??
                                                                        0
                                                                ]
                                                            }`,
                                                            target:
                                                                month?.targetQty ??
                                                                0,
                                                            value:
                                                                month?.actualQty ??
                                                                0,
                                                        })
                                                    ) ?? []
                                            ) ?? []
                                        }
                                    />
                                </div>
                                <div>
                                    <h4 className="text-center font-medium mb-2">
                                        Sales
                                    </h4>
                                    <Chart
                                        type={view}
                                        data={
                                            yearData?.markets?.flatMap(
                                                (market) =>
                                                    market?.months?.map(
                                                        (month) => ({
                                                            name: `${
                                                                groupBy ===
                                                                "market"
                                                                    ? market?.marketName
                                                                    : market?.district
                                                            } - ${
                                                                MONTHS[
                                                                    month?.month ??
                                                                        0
                                                                ]
                                                            }`,
                                                            target:
                                                                month?.targetQty ??
                                                                0,
                                                            value:
                                                                month?.actualSales ??
                                                                0,
                                                        })
                                                    ) ?? []
                                            ) ?? []
                                        }
                                    />
                                </div>
                            </div>
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
                                    {groupBy === "market"
                                        ? "Market"
                                        : "District"}
                                </TableHead>
                                <TableHead>Target Qty</TableHead>
                                <TableHead>Target Sale</TableHead>
                                <TableHead>Sold Qty</TableHead>
                                <TableHead>Sales</TableHead>
                                <TableHead>
                                    Achievement - Sold - Sales
                                </TableHead>
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
                                        {item?.targetQty ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {item?.targetSale ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {item?.actualQty ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(item?.actualSales)}
                                    </TableCell>
                                    <TableCell>
                                        {formatPercentage(
                                            item?.qtyAchievementPercentage
                                        )}{" "}
                                        -{" "}
                                        {formatPercentage(
                                            item?.salesAchievementPercentage
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                (item?.actualQty ?? 0) >=
                                                (item?.targetQty ?? 0)
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {(item?.actualQty ?? 0) >=
                                            (item?.targetQty ?? 0)
                                                ? "✅ Achieved"
                                                : "❌ Pending"}
                                        </Badge>
                                    </TableCell>
                                    {groupBy === "district" && (
                                        <TableCell>
                                            {item?.count ?? "-"}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-center font-medium mb-2">
                                Quantity
                            </h4>
                            <Chart
                                type={view}
                                data={
                                    data?.map((item) => ({
                                        name:
                                            groupBy === "market"
                                                ? item?.marketName ?? ""
                                                : item?.district ?? "",
                                        target: item?.targetQty ?? 0,
                                        value: item?.actualQty ?? 0,
                                    })) ?? []
                                }
                            />
                        </div>
                        <div>
                            <h4 className="text-center font-medium mb-2">
                                Sales
                            </h4>
                            <Chart
                                type={view}
                                data={
                                    data?.map((item) => ({
                                        name:
                                            groupBy === "market"
                                                ? item?.marketName ?? ""
                                                : item?.district ?? "",
                                        target: item?.targetQty ?? 0,
                                        value: item?.actualSales ?? 0,
                                    })) ?? []
                                }
                            />
                        </div>
                    </div>
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
        <div className="max-w-full mx-auto p-4">
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
                            Year - Month - Market
                        </SelectItem>
                        <SelectItem value="year-market-month">
                            Year - Market - Month
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
                        <SelectItem value="all">From All</SelectItem>
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
                        <SelectItem value="all">To All</SelectItem>
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

                {groupBy === "district" && data?.districts && (
                    <MultiSelect
                        options={data?.districts.map((d) => ({
                            id: d,
                            name: d,
                        }))}
                        onChange={(v) => setSelectedDistrict(v)}
                        selected={selectedDistrict}
                        placeholder="Select District"
                    />
                )}
                {groupBy === "market" && data?.markets && (
                    <MultiSelect
                        options={data?.markets}
                        onChange={(v) => setSelectedMarket(v)}
                        selected={selectedMarket}
                        placeholder="Select Market"
                    />
                )}

                <MultiSelect
                    options={
                        productData?.map((p) => ({
                            id: p?._id,
                            name: p?.name,
                        })) as { id: string; name: string }[]
                    }
                    onChange={(v) => setSelectedProduct(v)}
                    selected={selectedProduct}
                    placeholder="Select Product"
                />

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
