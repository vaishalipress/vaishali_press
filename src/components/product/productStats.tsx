"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BoomBox } from "lucide-react";
import { LoadingCells } from "@/components/loading";
import { useProductStats } from "@/hooks/use-fetch-data";
import { Filter } from "@/components/filter";
import { useFilterDate } from "@/hooks/useFilterDate";

export default function ProductStats() {
    const { date, setDate, toggleType, type } = useFilterDate();

    const { data, isLoading } = useProductStats(date);
    return (
        <div className="max-w-xl w-full flex flex-col gap-3">
            <div className="border w-full rounded-md py-3 shadow-md">
                <div className="flex flex-col justify-between gap-3 mb-3 px-3">
                    <div className="flex items-center gap-3">
                        <BoomBox className="text-indigo-500 w-6 h-6" />
                        <h1 className="uppercase text-indigo-600 font-bold text-lg">
                            Product Stats
                        </h1>
                    </div>

                    <Filter
                        html="#products"
                        downloadName="productStats"
                        date={date}
                        setDate={setDate}
                        toggleType={toggleType}
                        type={type}
                        isLoading={isLoading}
                    />
                </div>
                <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                    <Table id="products">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase min-w-[75px] lg:min-w-[120px]">
                                    Product
                                </TableHead>
                                <TableHead className="uppercase">
                                    Sold
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={2} />}
                            {data?.map((product) => (
                                <TableRow key={product?._id}>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {product?.sales}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
