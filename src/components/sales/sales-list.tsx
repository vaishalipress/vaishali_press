"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BaggageClaim, Download, IndianRupee } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "@/components/loading";
import { format } from "date-fns";
import { useSale } from "@/hooks/use-fetch-data";
import { FilterSale } from "@/components/sales/filter-sales";
import { useSaleFilter } from "@/hooks/useSaleFilter";
import Pagination from "../pagination/pagination";
import { downloadToPDF } from "@/lib/utils";
import { Suspense } from "react";

export default function SalesList() {
    const { onOpen } = useModal();
    const {
        date,
        setDate,
        toggleType,
        type,
        product,
        client,
        market,
        district,
        setClient,
        setProduct,
        page,
        view,
        setPage,
        setView,
    } = useSaleFilter();
    const { data, isLoading } = useSale(
        date,
        client,
        product,
        district,
        market,
        page,
        view
    ); //fetch data

    return (
        <div className="max-w-7xl w-full flex flex-col gap-3">
            <Suspense>
                <FilterSale
                    date={date}
                    setDate={setDate}
                    toggleType={toggleType}
                    type={type}
                    client={client}
                    product={product}
                    setClient={setClient}
                    setProduct={setProduct}
                    setPage={setPage}
                    setView={setView}
                    page={page}
                    view={view}
                />
            </Suspense>
            <div className="border w-full rounded-md py-3 shadow-md">
                <div className="flex justify-between gap-3 mb-3 px-3">
                    <div className="flex items-center gap-3">
                        <BaggageClaim className="text-indigo-500 w-6 h-6" />
                        <h1 className="uppercase text-indigo-600 font-bold text-lg">
                            Sales
                        </h1>
                        <span className="uppercase text-indigo-600 font-bold text-lg">
                            {data?.total}
                        </span>
                    </div>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() =>
                            downloadToPDF(
                                isLoading,
                                "#sales",
                                `sales-${client}-${product}.pdf`
                            )
                        }
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
                <div>
                    <Table id="sales">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase min-w-[75px] lg:min-w-[120px]">
                                    Date
                                </TableHead>
                                <TableHead className="uppercase">
                                    Client
                                </TableHead>
                                <TableHead className="uppercase">
                                    Market
                                </TableHead>
                                <TableHead className="uppercase">
                                    District
                                </TableHead>
                                <TableHead className="min-w-[150px] uppercase">
                                    Product
                                </TableHead>
                                <TableHead className="uppercase">Qty</TableHead>
                                <TableHead className="uppercase">
                                    Rate
                                </TableHead>
                                <TableHead className="uppercase min-w-[200px] lg:min-w-[140px]">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={8} />}
                            {data?.sales?.map((sale) => (
                                <TableRow
                                    key={sale?._id}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        onOpen("editSale", { sale });
                                    }}
                                >
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.date &&
                                            format(
                                                new Date(sale?.date),
                                                "dd-MM-yyyy"
                                            )}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.client?.name.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.client?.market
                                            ? sale?.client?.market.toUpperCase()
                                            : "NA"}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.client?.district.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="font-medium text-xs lg:text-sm">
                                        {sale?.name.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.qty}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3 text-black/60" />
                                            {sale?.rate}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        <div className="capitalize flex items-center">
                                            <p className="flex items-center">
                                                {sale?.qty} x
                                                <IndianRupee className="ml-1 w-3 h-3 text-black/60" />
                                                {sale?.rate}
                                            </p>
                                            <span className="mx-1">=</span>
                                            <IndianRupee className="w-3 h-3 text-black/60" />
                                            <span>
                                                {sale?.qty * sale?.rate}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Suspense>
                        {data && data?.total > Number(view) && (
                            <Pagination
                                isLoading={isLoading}
                                total={data?.total || 0}
                            />
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
