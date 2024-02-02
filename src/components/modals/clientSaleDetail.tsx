"use client";
import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { format } from "date-fns";

export const ClientSalesDetailsModal = () => {
    const { isOpen, type, data, onClose } = useModal();
    const isModalOpen = isOpen && type === "userSaleDetails";
    const { clientSalesDetail } = data;

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="lg:min-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="font-semibold uppercase">
                    Client
                </DialogHeader>

                {/* CLIENT */}

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableCell className="uppercase">
                                {clientSalesDetail?.name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>District</TableHead>
                            <TableCell className="uppercase">
                                {clientSalesDetail?.district}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Block</TableHead>
                            <TableCell className="uppercase">
                                {clientSalesDetail?.block}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Mobile</TableHead>
                            <TableCell>{clientSalesDetail?.mobile}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Sales</TableHead>
                            <TableCell>
                                {clientSalesDetail?.totalSale}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableCell>
                                {clientSalesDetail?.totalAmount}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* SALE */}

                <div className="overflow-auto lg:overflow-hidden">
                    <h1 className="font-semibold uppercase text-center lg:text-start mb-3">
                        Sales
                    </h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] uppercase">
                                    Product
                                </TableHead>
                                <TableHead className="uppercase min-w-[120px]">
                                    Date
                                </TableHead>
                                <TableHead className="uppercase">Qty</TableHead>
                                <TableHead className="uppercase">
                                    Rate
                                </TableHead>
                                <TableHead className="uppercase">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientSalesDetail?.sales.map((sale) => (
                                <TableRow key={sale._id}>
                                    <TableCell className="uppercase">
                                        {sale.name}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(sale.createdAt),
                                            "dd-MM-yyyy"
                                        )}
                                    </TableCell>
                                    <TableCell>{sale.qty}</TableCell>
                                    <TableCell>{sale.rate}</TableCell>
                                    <TableCell>{sale.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};
