"use client";

import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MONTHS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { capitalizeWords, downloadToPDF } from "@/lib/utils";

interface MarketData {
    name: string;
    target: number;
    qty: number;
}

interface DistrictData {
    district: string;
    totalTarget: number;
    totalQty: number;
    markets: MarketData[];
}

interface ApiResponse {
    success: boolean;
    results?: DistrictData[];
}

interface ResultStats {
    pass: number;
    fail: number;
}

export default function TargetAnalysisPage() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth.toString());
    const [district, setDistrict] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([
        "65b91e25c8aeefd5b6171ca1",
        "65b91da3f46eaa0c8bd42667",
    ]);

    // Generate date range for the selected month/year using UTC timezone
    const getDateRange = (year: number, monthIndex: number) => {
        // Create dates in UTC timezone for consistency
        const fromDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
        const toDate = new Date(
            Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)
        );

        return {
            from: fromDate.toISOString(),
            to: toDate.toISOString(),
        };
    };

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: ["target-analysis", year, month, district, selectedProducts],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("year", year.toString());
            params.append("month", month);

            const { from, to } = getDateRange(year, Number(month));
            params.set("from", from);
            params.set("to", to);

            if (district) {
                params.append("district", district);
            }

            if (selectedProducts?.length > 0) {
                params.append("productIds", selectedProducts.join(","));
            }

            const response = await axios.get(
                `/api/target/analysis?${params.toString()}`
            );
            return response.data;
        },
        enabled: Boolean(year && month !== ""), // Only run query when we have required params
    });

    // Calculate pass/fail statistics
    const resultStats: ResultStats = data?.results?.reduce(
        (stats, districtData) => {
            if (districtData.totalQty >= districtData.totalTarget) {
                stats.pass += 1;
            } else {
                stats.fail += 1;
            }
            return stats;
        },
        { pass: 0, fail: 0 }
    ) || { pass: 0, fail: 0 };

    const exportDataToPDF = async () => {
        if (isLoading || !data?.results?.length) return;

        const doc = new jsPDF();
        const exportData: (number | string)[][] = [];

        data.results.forEach((districtData, idx) => {
            const { totalTarget, totalQty, district } = districtData;
            const result = totalQty >= totalTarget ? "Pass" : "Fail";

            exportData.push([
                idx + 1,
                district.toUpperCase(),
                totalTarget,
                totalQty,
                result,
            ]);
        });

        autoTable(doc, {
            head: [["S.NO", "DISTRICT", "TARGET", "SOLD", "RESULT"]],
            body: exportData,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 165, 0] }, // Orange header
        });

        const monthName = MONTHS[Number(month)];
        doc.save(`District_Target_${monthName}_${year}.pdf`);
    };

    const calculateMarketStats = (markets: MarketData[]) => {
        return markets.reduce(
            (stats, market) => {
                if (market.qty >= market.target) {
                    stats.pass += 1;
                } else {
                    stats.fail += 1;
                }
                return stats;
            },
            { pass: 0, fail: 0 }
        );
    };

    const totalSold =
        data?.results?.reduce(
            (total, districtData) => total + districtData.totalQty,
            0
        ) || 0;

    const totalTarget =
        data?.results?.reduce(
            (total, districtData) => total + districtData.totalTarget,
            0
        ) || 0;

    return (
        <div className="max-w-full mx-auto p-4">
            {/* Filter Bar */}
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase font-semibold">
                    Target Analysis
                </h1>

                <div className="flex gap-2 flex-wrap">
                    <Input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        placeholder="Year"
                        className="w-32"
                        min="2020"
                        max="2030"
                    />

                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((monthName, index) => (
                                <SelectItem
                                    key={index}
                                    value={index.toString()}
                                >
                                    {monthName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Filter by district"
                        className="w-48"
                    />

                    <Button
                        variant="secondary"
                        onClick={exportDataToPDF}
                        disabled={isLoading || !data?.results?.length}
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-red-500 p-4 bg-red-50 rounded-md">
                    Error loading data. Please try again.
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && !data?.results?.length && (
                <div className="text-gray-500 p-8 text-center bg-gray-50 rounded-md">
                    No data available for the selected filters
                </div>
            )}

            {/* Data Display */}
            {!isLoading && !error && data?.results?.length && (
                <div className="bg-white rounded-lg shadow">
                    <Accordion type="multiple">
                        {data.results.map((districtData, idx) => {
                            const marketStats = calculateMarketStats(
                                districtData.markets
                            );
                            const isDistrictPassing =
                                districtData.totalQty >=
                                districtData.totalTarget;

                            return (
                                <AccordionItem
                                    key={districtData.district}
                                    value={districtData.district}
                                    className="mb-2 rounded"
                                >
                                    <AccordionTrigger className="hover:no-underline px-4 rounded bg-orange-200 dark:bg-orange-800">
                                        <div className="flex items-center space-x-4 w-full text-sm">
                                            <span className="mr-auto font-semibold uppercase">
                                                {idx + 1}.{" "}
                                                {districtData.district}
                                            </span>
                                            <div className="flex gap-3 px-3 min-w-60">
                                                <span>
                                                    Target:{" "}
                                                    {districtData.totalTarget}
                                                </span>
                                                <span>
                                                    Sold:{" "}
                                                    {districtData.totalQty}
                                                </span>
                                                <span
                                                    className={`font-semibold ${
                                                        isDistrictPassing
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    Result:{" "}
                                                    {isDistrictPassing
                                                        ? "Pass"
                                                        : "Fail"}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="text-end px-2 py-1 space-x-3">
                                            <span className="text-green-600">
                                                Pass: {marketStats.pass}
                                            </span>
                                            <span className="text-red-600">
                                                Fail: {marketStats.fail}
                                            </span>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={() =>
                                                    downloadToPDF(
                                                        false,
                                                        `#table${idx}`,
                                                        districtData.district
                                                    )
                                                }
                                                title={`Download ${districtData.district} report`}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Table id={`table${idx}`}>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Market
                                                    </TableHead>
                                                    <TableHead>
                                                        Target
                                                    </TableHead>
                                                    <TableHead>Sold</TableHead>
                                                    <TableHead>
                                                        Result
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {districtData.markets.map(
                                                    (market, marketIdx) => {
                                                        const isMarketPassing =
                                                            market.qty >=
                                                            market.target;

                                                        return (
                                                            <TableRow
                                                                key={
                                                                    market.name
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {marketIdx +
                                                                        1}
                                                                    .{" "}
                                                                    {capitalizeWords(
                                                                        market.name
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        market.target
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {market.qty}
                                                                </TableCell>
                                                                <TableCell
                                                                    className={`font-medium ${
                                                                        isMarketPassing
                                                                            ? "text-green-600"
                                                                            : "text-red-600"
                                                                    }`}
                                                                >
                                                                    {isMarketPassing
                                                                        ? "Pass"
                                                                        : "Fail"}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }
                                                )}
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>

                    {/* Summary Statistics */}
                    <div className="text-right px-4 py-3 bg-gray-50 rounded-b-lg space-x-6">
                        <span className="text-base font-medium">
                            Total Target: {totalTarget}
                        </span>
                        <span className="text-base font-medium">
                            Total Sold: {totalSold}
                        </span>
                        <span className="text-base font-medium text-green-600">
                            Pass: {resultStats.pass}
                        </span>
                        <span className="text-base font-medium text-red-600">
                            Fail: {resultStats.fail}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
