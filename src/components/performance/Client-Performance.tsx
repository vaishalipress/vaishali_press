"use client";
import { useClientPerformanceStats } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ClientPerformance as ClientPerformanceType } from "@/lib/types";
import { LoadingCells } from "@/components/loading";
import { FileWarning, IndianRupee } from "lucide-react";
import { useFilterDate } from "@/hooks/useFilterDate";
import { Filter } from "@/components/filter";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const ClientPerformance = () => {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useClientPerformanceStats(date);
    return (
        <div className="mb-4 w-full">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase  font-semibold">
                    Client Performance
                </h1>

                <Filter
                    date={date}
                    setDate={setDate}
                    type={type}
                    toggleType={toggleType}
                    isLoading={isLoading}
                    download={false}
                />
            </div>
            <div className="flex flex-wrap gap-3">
                {isLoading && (
                    <Table>
                        <TableBody>
                            <LoadingCells rows={4} />
                        </TableBody>
                    </Table>
                )}
                {!data?.[0] && !isLoading && (
                    <div className="flex items-center justify-center w-full">
                        <FileWarning className="text-rose-600" />
                        <p className="uppercase font-medium text-rose-600 text-lg">
                            No Data
                        </p>
                    </div>
                )}

                <Accordion type="multiple" className="w-full">
                    {data?.map((client, idx) => (
                        <Client
                            client={client}
                            idx={idx + 1}
                            key={client?.client?._id}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

const Client = ({
    client,
    idx,
}: {
    client: ClientPerformanceType;
    idx: number;
}) => {
    return (
        <AccordionItem
            value={client?.client?._id}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex items-center gap-2 w-[93%] justify-between">
                    <span className="text-sm font-medium  dark:text-zinc-200 uppercase">
                        {idx}. {client?.client?.name}
                    </span>
                    <div className="capitalize flex items-center text-xs dark:text-zinc-200 ">
                        <span className="mr-2">Amount : </span>
                        <IndianRupee className="w-3 h-3" />
                        <span>{client?.totalAmount}</span>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <Table>
                    <TableHeader>
                        <TableHead className="uppercase">Product</TableHead>
                        <TableHead className="uppercase">Qty</TableHead>
                        <TableHead className="uppercase">Amount</TableHead>
                    </TableHeader>
                    <TableBody>
                        {client?.sales?.map((sale) => (
                            <TableRow key={sale?.product}>
                                <TableCell className="uppercase">
                                    {sale?.product}
                                </TableCell>
                                <TableCell>{sale?.qty}</TableCell>
                                <TableCell>
                                    <div className="capitalize flex items-center">
                                        <IndianRupee className="w-3 h-3" />
                                        {sale.amount}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AccordionContent>
        </AccordionItem>
    );
};
