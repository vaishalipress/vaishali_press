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
import { Donut } from "../charts/donutChart";

export default function ClientStats() {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useClientStats(date);
    return (
        <div className="max-w-xl w-full flex flex-col gap-3">
            <div className="border w-full rounded-md py-3 shadow-md">
                <div className="flex flex-col justify-between gap-3 mb-3 px-3">
                    <div className="flex items-center gap-3">
                        <UserSearch className="text-indigo-500 w-6 h-6" />
                        <h1 className="uppercase text-indigo-600 font-bold text-lg">
                            Client Stats
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
                <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                    <Table id="clientStats">
                        <TableHeader>
                            <TableRow>
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
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={2} />}
                            {data?.map((client) => (
                                <TableRow key={client?._id}>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {client.name}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {client?.market}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {client?.district}
                                    </TableCell>
                                    <TableCell>
                                        <div className="capitalize flex items-center text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3" />
                                            {client?.amount}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {data?.[0] && (
                <Donut
                    rupeeSymbol
                    data={[
                        { name: data?.[0]?.name, value: data?.[0]?.amount },
                        { name: data?.[1]?.name, value: data?.[1]?.amount },
                        { name: data?.[2]?.name, value: data?.[2]?.amount },
                    ]}
                    title="Top Client"
                />
            )}
        </div>
    );
}
