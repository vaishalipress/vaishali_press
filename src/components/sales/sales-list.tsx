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
import { BaggageClaim, Pen, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "@/components/loading";
import { format } from "date-fns";
import { useSale } from "@/hooks/use-fetch-data";
import { FilterSale } from "@/components/sales/filter-sales";
import { useFilter } from "@/hooks/useFilter";

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
    } = useFilter();
    const { data, isLoading } = useSale(
        date,
        client,
        product,
        district,
        market
    ); //fetch data

    return (
        <div className="max-w-7xl w-full flex flex-col gap-3">
            <FilterSale
                date={date}
                setDate={setDate}
                toggleType={toggleType}
                type={type}
                client={client}
                product={product}
                setClient={setClient}
                setProduct={setProduct}
            />
            <div className="border w-full rounded-md py-3 shadow-md">
                <div className="flex items-center gap-3 mb-3 px-3">
                    <BaggageClaim className="text-indigo-500 w-6 h-6" />
                    <h1 className="uppercase text-indigo-600 font-bold text-lg">
                        Sales
                    </h1>
                </div>
                <div>
                    <Table>
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
                                <TableHead className="uppercase min-w-[100px] lg:min-w-[140px]">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={8} />}
                            {data?.map((sale) => (
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
                                    <TableCell className="uppercase text-xs lg:text-sm">
                                        {sale?.client?.name}
                                    </TableCell>
                                    <TableCell className="uppercase text-xs lg:text-sm">
                                        {sale?.client?.market
                                            ? sale?.client?.market
                                            : "NA"}
                                    </TableCell>
                                    <TableCell className="uppercase text-xs lg:text-sm">
                                        {sale?.client?.district}
                                    </TableCell>
                                    <TableCell className="font-medium uppercase text-xs lg:text-sm">
                                        {sale?.name}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.qty}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.rate}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.qty} x {sale?.rate} ={" "}
                                        {sale?.qty * sale?.rate}
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
