"use client";
import { useProductStats } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DistrictSalesStats,
    MarketStatsInProductPerformance,
    ProductPerformance as ProductPerformanceType,
    ProductStats,
} from "@/lib/types";
import { LoadingCells } from "@/components/loading";
import { Download, FileWarning, IndianRupee } from "lucide-react";
import { useFilterDate } from "@/hooks/useFilterDate";
import { Filter } from "@/components/filter";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ProductPerformanceByClient = () => {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useProductStats(date);

    const exportDataToPDF = async () => {
        if (isLoading) return;
        const doc = new jsPDF();
        const exportData: string[][] = [];
        data?.forEach((d, idx) => {
            exportData.push([
                `${idx + 1}`,
                d?.name?.toUpperCase(),
                d?.price?.toString(),
                d?.sale?.toString(),
                d?.sales?.length?.toString(),
                d?.amount?.toString(),
            ]);
        });

        autoTable(doc, {
            head: [["S.NO", "PRODUCT", "PRICE", "SOLD", "CLIENT", "AMOUNT"]],
            body: exportData,
        });

        doc.save("ALL_PRODUCT_PERFORMANCE_BY_CLIENT.pdf");
    };
    return (
        <div className="mb-4 w-full">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase  font-semibold">
                    Product Performance By Client
                </h1>

                <Filter
                    date={date}
                    setDate={setDate}
                    type={type}
                    toggleType={toggleType}
                    isLoading={isLoading}
                >
                    <Button variant={"secondary"} onClick={exportDataToPDF}>
                        <Download className="w-5 h-5" />
                    </Button>
                </Filter>
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
                    {data?.map((product, idx) => (
                        <ProductStats
                            product={product}
                            idx={idx + 1}
                            key={product?.name}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

const ProductStats = ({
    product,
    idx,
}: {
    idx: number;
    product: ProductStats;
}) => {
    return (
        <AccordionItem
            value={product?.name}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex items-center gap-2 w-[93%] justify-between">
                    <span className="text-sm font-medium  dark:text-zinc-200 uppercase">
                        {idx}. {product?.name}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs dark:text-zinc-200 uppercase">
                            SOLD : {product?.sale}
                        </span>
                        <span className="text-xs dark:text-zinc-200 uppercase">
                            CLIENT : {product?.sales?.length}
                        </span>
                        <span className="text-xs dark:text-zinc-200 uppercase">
                            AMOUNT : {product?.amount}
                        </span>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S.NO</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead>MARKET</TableHead>
                            <TableHead>DISTRICT</TableHead>
                            <TableHead>QTY</TableHead>
                            <TableHead>AMOUNT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {product?.sales?.map((client, idx) => (
                            <TableRow key={client?.client?._id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell className="capitalize text-start">
                                    {client?.client?.name}
                                </TableCell>
                                <TableCell className="capitalize text-start">
                                    {client?.client?.market}
                                </TableCell>
                                <TableCell className="capitalize text-start">
                                    {client?.client?.district}
                                </TableCell>
                                <TableCell className="text-start">
                                    {client?.qty}
                                </TableCell>
                                <TableCell className="capitalize text-start">
                                    <div className="flex items-center text-xs lg:text-sm">
                                        <IndianRupee className="w-3 h-3" />
                                        {client?.amount}
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

const Market = ({ market }: { market: MarketStatsInProductPerformance[] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="text-xs">
                    <TableHead>S.NO</TableHead>
                    <TableHead className="uppercase w-32">Market</TableHead>
                    <TableHead className="uppercase w-32">Sold</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {market?.map((m, idx) => (
                    <TableRow key={m.market}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="uppercase text-xs">
                            {m?.market}
                        </TableCell>

                        <TableCell className="text-xs">{m?.sales}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
