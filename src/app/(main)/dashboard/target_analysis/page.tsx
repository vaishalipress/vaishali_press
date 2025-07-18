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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MONTHS } from "@/lib/constants";
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
            if (selectedProducts?.length > 0) {
                params.append("productIds", selectedProducts.join(","));
            }
            console.log(params.get("productIds"));
            const res = await axios.get(
                `/api/target/analysis?${params.toString()}`
            );
            return res.data;
        },
    });

    return (
        <div className="max-w-full mx-auto p-4">
            {/* Always visible filter bar */}
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase  font-semibold">
                    Target Analysis
                </h1>

                <div className="flex gap-2">
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

                    <MultiSelect
                        options={
                            products
                                ?.sort((a, b) =>
                                    a?.name?.localeCompare(b?.name)
                                )
                                .map((p) => ({
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
                        {data.results.map((districtData, idx) => {
                            const sum =
                                districtData?.totalTarget -
                                districtData?.totalQty;
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
                                                <span>
                                                    Result:{" "}
                                                    {sum < 0
                                                        ? `+${-1 * sum}`
                                                        : `${
                                                              sum !== 0
                                                                  ? "-"
                                                                  : ""
                                                          }${sum}`}
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
                                                    <TableHead>
                                                        Result
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {districtData.markets.map(
                                                    (market) => {
                                                        const result =
                                                            market.target -
                                                            market.qty;

                                                        return (
                                                            <TableRow
                                                                key={
                                                                    market.name
                                                                }
                                                            >
                                                                <TableCell className="capitalize">
                                                                    {
                                                                        market.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        market.target
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {market.qty}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {result < 0
                                                                        ? `+${
                                                                              -1 *
                                                                              result
                                                                          }`
                                                                        : `${
                                                                              result ===
                                                                              0
                                                                                  ? result
                                                                                  : "-" +
                                                                                    result
                                                                          }`}
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
