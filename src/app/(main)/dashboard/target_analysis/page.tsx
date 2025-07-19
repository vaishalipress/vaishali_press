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
import { MultiSelect } from "./component/multi-select";
import { useProduct } from "@/hooks/use-fetch-data";
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
import { capitalizeWords, downloadToPDF, getDayMax } from "@/lib/utils";

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

function getMaxDateForMonth(year: number, month: number): Date {
    // Create date for first day of next month
    const firstDayNextMonth = new Date(year, month + 1, 1);

    // Subtract 1 millisecond to get last moment of current month
    const lastMomentOfMonth = new Date(firstDayNextMonth.getTime() - 1);

    return lastMomentOfMonth;
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

    // const { data: products } = useProduct();

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: ["target-analysis", year, month, district, selectedProducts],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("year", year.toString());
            params.append("month", month);

            const fromDate = new Date(year, Number(month), 1); // July 1, 2025
            const toDate = new Date(year, Number(month + 1), 0); // July 31, 2025

            params.set("from", fromDate.toUTCString());
            params.set("to", toDate.toUTCString());
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

    const exportDataToPDF = async () => {
        if (isLoading) return;
        const doc = new jsPDF();
        const exportData: (number | string)[][] = [];
        data?.results?.forEach((d, idx) => {
            const totalTarget = d?.totalTarget;
            const totalQty = d?.totalQty;
            const result = totalQty - totalTarget;
            exportData.push([
                `${idx + 1}`,
                d?.district?.toUpperCase(),
                totalTarget,
                totalQty,
                result >= 0 ? "Pass" : "Fail",
            ]);
        });

        autoTable(doc, {
            head: [["S.NO", "DISTRICT", "TARGET", "SOLD", "RESULT"]],
            body: exportData,
        });

        doc.save("District_Target.pdf");
    };
    const [result, setResult] = useState({ pass: 0, fail: 0 });
    useEffect(() => {
        const d = { ...result };
        data?.results?.forEach((r) => {
            if (r.totalQty >= r.totalTarget) {
                d.pass += 1;
            } else {
                d.fail += 1;
            }
            setResult(d);
        });
    }, [data]);

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

                    {/* <MultiSelect
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
                    /> */}

                    <Input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Filter by district"
                        className="w-48"
                    />

                    <Button variant={"secondary"} onClick={exportDataToPDF}>
                        <Download className="w-5 h-5" />
                    </Button>
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
                                                    {districtData?.totalQty >=
                                                    districtData?.totalTarget
                                                        ? "Pass"
                                                        : "Fail"}{" "}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="text-end px-2 py-1 space-x-3">
                                            <span>
                                                Pass :{" "}
                                                {districtData.markets?.reduce(
                                                    (prev, curr) =>
                                                        prev +
                                                        (curr.qty >=
                                                        curr?.target
                                                            ? 1
                                                            : 0),
                                                    0
                                                )}
                                            </span>
                                            <span>
                                                Fail :{" "}
                                                {districtData.markets?.reduce(
                                                    (prev, curr) =>
                                                        prev +
                                                        (curr.qty >=
                                                        curr?.target
                                                            ? 0
                                                            : 1),
                                                    0
                                                )}
                                            </span>
                                            <Button
                                                variant={"secondary"}
                                                size={"icon"}
                                                onClick={() =>
                                                    downloadToPDF(
                                                        isLoading,
                                                        `#table${idx}`,
                                                        districtData?.district
                                                    )
                                                }
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
                                                    (market, idx) => {
                                                        const result =
                                                            market.qty -
                                                            market.target;

                                                        return (
                                                            <TableRow
                                                                key={
                                                                    market.name
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {idx + 1}.{" "}
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
                                                                <TableCell>
                                                                    {result >= 0
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

                    <div className="text-right">
                        <span className="text-right text-base px-10">
                            Total Sold :{" "}
                            {data?.results?.reduce(
                                (prev, curr) => prev + curr.totalQty,
                                0
                            )}
                        </span>
                        <span className="text-right text-base px-10">
                            Total Pass : {result?.pass}
                        </span>
                        <span className="text-right text-base px-10">
                            Total Fail : {result?.fail}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
