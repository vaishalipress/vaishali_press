"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IndianRupee, UserSearch } from "lucide-react";
import { LoadingCells } from "@/components/loading";
import { useClientStats } from "@/hooks/use-fetch-data";
import { Filter } from "@/components/filter";
import { useFilterDate } from "@/hooks/useFilterDate";
import { Donut } from "@/components/charts/donutChart";
import { useEffect, useState } from "react";

export default function ClientStats() {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useClientStats(date);
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        let AmountSum = 0;
        data?.forEach((s) => {
            AmountSum += s?.amount;
        });
        setAmount(AmountSum);
    }, [data]);
    return (
        <div className="max-w-3xl w-full flex flex-col gap-3">
            {!isLoading && data?.[0]?.amount !== 0 && (
                <Donut
                    rupeeSymbol
                    data={[
                        { name: data?.[0]?.name!, value: data?.[0]?.amount! },
                        { name: data?.[1]?.name!, value: data?.[1]?.amount! },
                        { name: data?.[2]?.name!, value: data?.[2]?.amount! },
                    ]}
                    title="Top Client"
                />
            )}
            <div className="border w-full rounded-md shadow-md">
                <div className="flex flex-col justify-between gap-3 px-3 py-3 bg-[#FFCCCC] dark:bg-slate-300 rounded-tl-md rounded-tr-md">
                    <div className="flex items-center gap-3">
                        <UserSearch className="text-[#174634] w-6 h-6" />
                        <h1 className="uppercase text-[#174634] font-bold text-sm lg:text-lg">
                            Client Performance
                        </h1>
                    </div>

                    <Filter
                        html="#clientStats"
                        downloadName="clientStats"
                        date={date}
                        setDate={setDate}
                        toggleType={toggleType}
                        type={type}
                        isLoading={isLoading}
                    />
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    <Table id="clientStats">
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.No</TableHead>
                                <TableHead className="uppercase min-w-[75px] lg:min-w-[120px]">
                                    Name
                                </TableHead>
                                <TableHead className="uppercase">
                                    Market
                                </TableHead>
                                <TableHead className="uppercase">
                                    District
                                </TableHead>
                                <TableHead className="uppercase">
                                    Sales
                                </TableHead>
                                <TableHead className="uppercase text-right">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={6} rows={5} />}
                            {data?.map((client, idx) => (
                                <TableRow key={client?._id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {client?.name?.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {client?.market?.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {client?.district?.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {client?.sales}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3" />
                                            {client?.amount}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={5}>Total</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center text-xs lg:text-sm">
                                        <IndianRupee className="w-3 h-3" />
                                        {amount}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
