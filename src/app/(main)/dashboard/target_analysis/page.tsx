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
import { IndianRupee } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "./component/multi-select";
import { useProduct } from "@/hooks/use-fetch-data";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Chart = dynamic(() => import("@/components/charts/Chart"), {
    ssr: false,
});

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

export default function TargetAnalysisPage() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth.toString());
    const [district, setDistrict] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const { data: products } = useProduct();

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: ["target-analysis", year, month, district, selectedProducts],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("year", year.toString());
            params.append("month", month);
            if (district) params.append("district", district);
            if (selectedProducts?.length) {
                params.append("productIds", selectedProducts.join(","));
            }

            const res = await axios.get(
                `/api/target/analysis?${params.toString()}`
            );
            return res.data;
        },
    });

    const formatPercentage = (value?: number) => {
        if (value == null) return "-";
        return `${Math.round(value)}%`;
    };

    const calculateAchievement = (actual?: number, target?: number) => {
        if (target == null || actual == null || target === 0) return 0;
        return (actual / target) * 100;
    };

    return (
        <div className="max-w-full mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">
                📈 Target Analysis Dashboard
            </h2>

            {/* Always visible filter bar */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    placeholder="Year"
                    className="w-32"
                />

                <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        {MONTHS.map((monthName, index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {monthName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <MultiSelect
                    options={
                        products?.map((p) => ({
                            id: p?._id,
                            name: p?.name,
                        })) || []
                    }
                    selected={selectedProducts}
                    onChange={setSelectedProducts}
                    placeholder="Select products"
                />

                <Input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Filter by district"
                    className="w-48"
                />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 p-4">Error loading data</div>
            ) : !data?.results?.length ? (
                <div className="text-gray-500 p-4">
                    No data available for the selected filters
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <Accordion type="multiple">
                        {data.results.map((districtData) => {
                            const achievement = calculateAchievement(
                                districtData.totalQty,
                                districtData.totalTarget
                            );

                            return (
                                <AccordionItem
                                    key={districtData.district}
                                    value={districtData.district}
                                >
                                    <AccordionTrigger className="hover:no-underline px-4">
                                        <div className="flex items-center space-x-4 w-full">
                                            <span className="font-semibold">
                                                {districtData.district}
                                            </span>
                                            <div className="flex-1 flex justify-between pr-4">
                                                <span>
                                                    Target:{" "}
                                                    {districtData.totalTarget.toLocaleString()}
                                                </span>
                                                <span>
                                                    Sold:{" "}
                                                    {districtData.totalQty.toLocaleString()}
                                                </span>
                                                <span>
                                                    Achievement:{" "}
                                                    {formatPercentage(
                                                        achievement
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Market
                                                    </TableHead>
                                                    <TableHead>
                                                        Target
                                                    </TableHead>
                                                    <TableHead>Sold</TableHead>
                                                    <TableHead>Sales</TableHead>
                                                    <TableHead>
                                                        Achievement
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {districtData.markets.map(
                                                    (market) => {
                                                        const marketAchievement =
                                                            calculateAchievement(
                                                                market.qty,
                                                                market.target
                                                            );

                                                        return (
                                                            <TableRow
                                                                key={
                                                                    market.name
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        market.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {market.target.toLocaleString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {market.qty.toLocaleString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IndianRupee className="inline h-4 w-4" />
                                                                    {(
                                                                        market.qty *
                                                                        100
                                                                    ).toLocaleString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatPercentage(
                                                                        marketAchievement
                                                                    )}
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
                </div>
            )}
        </div>
    );
}
