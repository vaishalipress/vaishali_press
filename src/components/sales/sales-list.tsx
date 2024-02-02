"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Boxes, Pen, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "../loading";
import { format } from "date-fns";
import { useSale } from "@/hooks/use-fetch-data";

export default function SalesList() {
    const { onOpen } = useModal();
    const { data, isLoading } = useSale();

    return (
        <div className="border max-w-7xl w-full rounded-md py-3 shadow-md">
            <div className="flex items-center gap-3 mb-3 px-3">
                <Boxes className="text-indigo-500 w-6 h-6"/>
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
                            <TableHead className="uppercase">Client</TableHead>
                            <TableHead className="uppercase">Market</TableHead>
                            <TableHead className="uppercase">Block</TableHead>
                            <TableHead className="uppercase">
                                District
                            </TableHead>
                            <TableHead className="min-w-[150px] uppercase">
                                Product
                            </TableHead>
                            <TableHead className="uppercase">Qty</TableHead>
                            <TableHead className="uppercase">Rate</TableHead>
                            <TableHead className="uppercase min-w-[100px] lg:min-w-[140px]">
                                Amount
                            </TableHead>
                            <TableHead className="text-right uppercase min-w-[100px] md:min-w-[150px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <LoadingCells cols={10} />}
                        {data?.map((sale) => (
                            <TableRow key={sale?._id}>
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
                                    {sale?.client?.market}
                                </TableCell>
                                <TableCell className="uppercase text-xs lg:text-sm">
                                    {sale?.client?.block}
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
                                <TableCell className="text-right">
                                    {/* EDIT BTN */}
                                    <Button
                                        variant={"outline"}
                                        className="px-2 py-0"
                                        onClick={() => {
                                            onOpen("editSale", { sale });
                                        }}
                                    >
                                        <Pen className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                    {/* DELETE BTN */}
                                    <Button
                                        variant={"outline"}
                                        className="ml-2 px-2 py-0"
                                        onClick={() => {
                                            onOpen("deleteSale", { sale });
                                        }}
                                    >
                                        <Trash className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
