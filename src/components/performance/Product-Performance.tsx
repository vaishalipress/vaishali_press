"use client";
import { useAllProductPerformanceInDetails } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    MarketStatsInProductPerformance,
    ProductPerformance as ProductPerformanceType,
} from "@/lib/types";
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

export const ProductPerformance = () => {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useAllProductPerformanceInDetails(date);
    return (
        <div className="mb-4 w-full">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase  font-semibold">
                    Product Performance
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
                    {data?.map((product, idx) => (
                        <ProductStats
                            product={product}
                            idx={idx + 1}
                            key={product?.product}
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
    product: ProductPerformanceType;
}) => {
    return (
        <AccordionItem
            value={product?.product}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex items-center gap-2 w-[93%] justify-between">
                    <span className="text-sm font-medium  dark:text-zinc-200 uppercase">
                        {idx}. {product?.product}
                    </span>
                    <span className="text-xs dark:text-zinc-200 uppercase">
                        SOLD : {product?.totalSales}
                    </span>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <div className="flex gap-3 flex-wrap px-3 py-3">
                    {product?.stats?.map((stat) => (
                        <div
                            key={stat?.district}
                            className="border rounded-md overflow-hidden"
                        >
                            <div className="bg-rose-50 dark:bg-slate-600 flex justify-between items-start px-3 py-3 ">
                                <span className="text-xs dark:text-zinc-200 uppercase">
                                    {stat?.district}
                                </span>
                                <span className="text-xs dark:text-zinc-200 uppercase">
                                    sold : {stat?.sales}
                                </span>
                            </div>
                            <Market market={stat?.market} />
                        </div>
                    ))}
                </div>
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
