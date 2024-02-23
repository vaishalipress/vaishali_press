"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IndianRupee } from "lucide-react";

export const ProductSalesWithClients = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "productSalesWithClient";
    const { productSalesWithClients } = data;

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-[600px] px-1 md:px-4 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center uppercase font-bold">
                        Product Stats
                    </DialogTitle>

                    <div>
                        <h1 className="uppercase font-semibold text-start">
                            {" "}
                            Product
                        </h1>
                        <Table className="w-fit md:w-full">
                            <TableBody>
                                <TableRow>
                                    <TableCell>NAME</TableCell>
                                    <TableCell className="uppercase">
                                        {productSalesWithClients?.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>SOLD</TableCell>
                                    <TableCell>
                                        {productSalesWithClients?.sale}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>AMOUNT</TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3" />
                                            {productSalesWithClients?.amount}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="max-h-96 h-96 max-w-[95vw] w-fit md:w-full">
                        <h1 className="uppercase font-semibold text-start">
                            Clients
                        </h1>
                        <div className="max-h-96 h-96 overflow-auto">
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
                                    {productSalesWithClients?.sales?.map(
                                        (client, idx) => (
                                            <TableRow key={client?.client?._id}>
                                                <TableCell className="capitalize text-start">
                                                    {idx + 1}
                                                </TableCell>
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
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
