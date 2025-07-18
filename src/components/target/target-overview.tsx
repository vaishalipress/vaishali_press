"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IndianRupee, Loader2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { MONTHS } from "@/lib/constants";
import { FilterTarget } from "./target-filter";
import { useState } from "react";
import { MarketType } from "@/lib/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

interface DistrictType {
    district: string;
    totalTarget: number;
    markets: Omit<MarketType, "district">[];
}
interface TargetResponse {
    results: DistrictType[];
}

export default function TargetOverview() {
    const { onOpen } = useModal();

    const { data, isLoading, isError } = useQuery<TargetResponse>({
        queryKey: ["target-overview"],
        queryFn: async () => {
            const res = await axios.get(`/api/target`);
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
        <div className="max-w-7xl w-full mx-auto px-2 py-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🎯 Target Overview
            </h2>

            <div className="w-full space-y-4">
                <Accordion type="multiple" className="w-full">
                    {data?.results?.map((district, idx) => (
                        <District
                            distict={district}
                            idx={idx + 1}
                            key={district?.district}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    );
}

const District = ({ distict, idx }: { distict: DistrictType; idx: number }) => {
    return (
        <AccordionItem
            value={distict.district}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex  w-full items-center gap-2 justify-between">
                    <span className="text-sm font-medium  dark:text-zinc-200 uppercase">
                        {idx}. {distict?.district}
                    </span>
                    <div className="capitalize flex items-center text-xs dark:text-zinc-200 ">
                        <span className="mr-2">Total Target : </span>
                        <span>{distict.totalTarget}</span>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <Table>
                    <TableHeader>
                        <TableHead className="uppercase">S.No</TableHead>
                        <TableHead className="uppercase">Market</TableHead>
                        <TableHead className="uppercase">Target</TableHead>
                    </TableHeader>
                    <TableBody>
                        {distict?.markets?.map((market, idx) => (
                            <TableRow key={market?._id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell className="uppercase">
                                    {market?.name}
                                </TableCell>
                                <TableCell>{market?.target}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AccordionContent>
        </AccordionItem>
    );
};
