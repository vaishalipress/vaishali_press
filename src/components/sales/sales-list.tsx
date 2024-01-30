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
import { Pen, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "../loading";
import { format } from "date-fns";
import { useSale } from "@/hooks/use-fetch-data";

export default function SalesList() {
    const { onOpen } = useModal();
    const { data, isLoading } = useSale();

    return (
        <div className="border max-w-6xl w-full rounded-md py-3">
            <h1 className="uppercase font-semibold mb-3 px-3 text-sm md:text-base">
                Sales
            </h1>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] uppercase">
                                Product
                            </TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Date
                            </TableHead>
                            <TableHead className="uppercase">Client</TableHead>
                            <TableHead className="uppercase">
                                District
                            </TableHead>
                            <TableHead className="uppercase">Block</TableHead>
                            <TableHead className="uppercase">Qty</TableHead>
                            <TableHead className="uppercase">Rate</TableHead>
                            <TableHead className="uppercase">Payment</TableHead>
                            <TableHead className="uppercase">Dues</TableHead>
                            <TableHead className="text-right uppercase min-w-[130px] md:min-w-[150px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <LoadingCells cols={10} />}
                        {data?.map((sale) => (
                            <TableRow key={sale?._id}>
                                <TableCell className="font-medium uppercase">
                                    {sale?.name}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(sale.createdAt),
                                        "dd-MM-yyyy"
                                    )}
                                </TableCell>
                                <TableCell className="uppercase">
                                    {sale?.client?.name}
                                </TableCell>
                                <TableCell className="uppercase">
                                    {sale?.client?.district}
                                </TableCell>
                                <TableCell className="uppercase">
                                    {sale.client?.block}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {sale?.qty}
                                </TableCell>
                                <TableCell>{sale?.rate}</TableCell>
                                <TableCell>{sale?.payment}</TableCell>
                                <TableCell>
                                    {sale?.rate * sale?.qty - sale?.payment}
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
