"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BoomBox, IndianRupee } from "lucide-react";
import { LoadingCells } from "@/components/loading";
import { useProductStats } from "@/hooks/use-fetch-data";
import { Filter } from "@/components/filter";
import { useFilterDate } from "@/hooks/useFilterDate";
import { Donut } from "../charts/donutChart";

export default function ProductStats() {
    const { date, setDate, toggleType, type } = useFilterDate();

    const { data, isLoading } = useProductStats(date);
    return (
        <div className="max-w-xl w-full flex flex-col gap-3">
            <div className="border w-full rounded-md shadow-md">
                <div className="flex flex-col justify-between gap-3 py-3 px-3 bg-[#FFCCCC] dark:bg-slate-300 rounded-tl-md rounded-tr-md">
                    <div className="flex items-center gap-3">
                        <BoomBox className="text-[#174634] w-6 h-6" />
                        <h1 className="uppercase text-[#174634] font-bold text-sm lg:text-lg">
                            Product Performance
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
                <div className="max-h-[500px] overflow-y-auto">
                    <Table id="products">
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.No</TableHead>
                                <TableHead className="uppercase min-w-[75px] lg:min-w-[120px]">
                                    Product
                                </TableHead>
                                <TableHead className="uppercase">
                                    Price
                                </TableHead>
                                <TableHead className="uppercase">
                                    Sold
                                </TableHead>
                                <TableHead className="uppercase">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={5} rows={5} />}
                            {data?.map((product, idx) => (
                                <TableRow key={product?._id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell className="text-xs lg:text-sm uppercase">
                                        {product?.name}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        <div className="flex items-center text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3" />
                                            {product?.price}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {product?.sales}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3" />
                                            {product?.amount}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!isLoading && data?.[0]?.sales !== 0 && (
                <Donut
                    data={[
                        { name: data?.[0]?.name!, value: data?.[0]?.sales! },
                        { name: data?.[1]?.name!, value: data?.[1]?.sales! },
                        { name: data?.[2]?.name!, value: data?.[2]?.sales! },
                    ]}
                    title="Top Product"
                />
            )}
        </div>
    );
}
