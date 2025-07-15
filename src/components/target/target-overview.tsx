"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { MONTHS } from "@/lib/constants";
import { FilterTarget } from "./target-filter";
import { useState } from "react";

interface TargetResponseType {
    year: number;
    months: {
        month: number;
        districts: {
            _id: string;
            market: string;
            targetValue: number;
        }[];
    }[];
}

interface TargetResponse {
    results: TargetResponseType[];
    years: number[];
}

export default function TargetOverview() {
    const [market, setMarket] = useState("all");
    const [month, setMonth] = useState("all");
    const [year, setYear] = useState("all");
    const [page, setPage] = useState(1);
    const [view, setView] = useState(50);

    const { onOpen } = useModal();
    const { data, isLoading, isError } = useQuery<TargetResponse>({
        queryKey: ["target-overview", { market, month, year, page, view }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (market !== "all") params.append("market", market);
            if (month !== "all") params.append("month", month);
            if (year !== "all") params.append("year", year);
            params.append("page", page.toString());
            params.append("limit", view.toString());

            const res = await axios.get(`/api/target?${params.toString()}`);
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to load targets.
            </div>
        );
    }

    return (
        <>
            <FilterTarget
                market={market}
                setMarket={setMarket}
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                page={page}
                setPage={setPage}
                view={view}
                setView={setView}
                years={data?.years}
            />

            <div className="max-w-7xl w-full mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    🎯 Target Overview
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.results?.map((item) => (
                        <div
                            key={item.year}
                            className="border border-gray-300 bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            {/* Year Header */}
                            <div className="bg-blue-100 px-4 py-3 border-b border-blue-300">
                                <h3 className="text-lg font-bold text-blue-800">
                                    📅 Year: {item.year}
                                </h3>
                            </div>

                            {/* Months */}
                            {item.months.map((monthBlock, index) => (
                                <div
                                    key={index}
                                    className="border-t border-gray-200 px-4 py-4"
                                >
                                    <h4 className="text-md font-semibold text-indigo-600 mb-2">
                                        📆 {MONTHS[monthBlock.month]}
                                    </h4>

                                    <div className="space-y-2">
                                        {monthBlock.districts.map((target) => (
                                            <div
                                                key={target._id}
                                                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition p-3 border rounded-md space-x-2"
                                            >
                                                <div className="flex-1 text-sm font-medium text-gray-800">
                                                    {target.market.toUpperCase()}
                                                </div>
                                                <div className="text-green-700 font-semibold text-sm">
                                                    🎯 {target.targetValue}
                                                </div>
                                                <Button
                                                    size={"icon"}
                                                    variant={"secondary"}
                                                    onClick={() =>
                                                        onOpen("editTarget", {
                                                            target: {
                                                                ...target,
                                                                month: monthBlock.month,
                                                                year: item?.year,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
