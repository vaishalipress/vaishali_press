"use client";
import { useDistrictPerformanceByProducts } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ProductStatsInEachMarket,
    ProductStatsInEachDistrict,
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

export const DistrictPerformanceByProducts = () => {
    const { date, setDate, toggleType, type } = useFilterDate();
    const { data, isLoading } = useDistrictPerformanceByProducts(date);
    return (
        <div className="mb-4 mt-6 w-full">
            <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
                <h1 className="text-sm lg:text-base uppercase font-semibold">
                    District Performance By Products
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
                    {data?.map((dist) => (
                        <District dist={dist} key={dist?.district} />
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

const District = ({ dist }: { dist: ProductStatsInEachDistrict }) => {
    return (
        <AccordionItem
            value={dist?.district}
            className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
        >
            <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
                <div className="flex items-center gap-2 w-[93%] justify-between">
                    <span className="w-fit text-sm font-medium uppercase">
                        {dist?.district}
                    </span>
                    <span className="text-xs uppercase">
                        Total Sold : {dist?.totalQtySold}
                    </span>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <div className="flex gap-3 flex-wrap px-3 py-3">
                    {dist?.markets?.map((market) => (
                        <Market market={market} key={market?.name} />
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

const Market = ({ market }: { market: ProductStatsInEachMarket }) => {
    return (
        <div className="pb-3 border rounded-md flex flex-col gap-2">
            <div className="flex justify-between items-center bg-green-300 dark:bg-green-600 py-2 px-3 rounded-tl-md rounded-tr-md">
                <span className="font-medium capitalize text-sm">
                    {market?.name}
                </span>

                <span className="font-medium capitalize text-xs">
                    Total Sold : {market?.totalQtySold}
                </span>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead className="uppercase w-32">
                            Product
                        </TableHead>
                        <TableHead className="uppercase w-32">
                            Avg Price
                        </TableHead>
                        <TableHead className="uppercase w-32">Sold</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {market.products.map((product) => (
                        <TableRow key={product?.name}>
                            <TableCell className="uppercase text-xs">
                                {product?.name}
                            </TableCell>
                            <TableCell className="text-xs">
                                <div className="capitalize flex items-center">
                                    <IndianRupee className="w-3 h-3" />
                                    {product?.avgPrice}
                                </div>
                            </TableCell>
                            <TableCell className="text-xs">
                                {product?.totalQtySold}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
