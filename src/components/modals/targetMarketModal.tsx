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
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { capitalizeWords, downloadToPDF } from "@/lib/utils";
import { useMemo } from "react";

export const MarketTargetInfoModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "marketTargetInfo";
    const { marketTarget } = data;
    const sortedClients = useMemo(
        () => marketTarget?.clients?.sort((a, b) => b.qty - a.qty),
        [marketTarget]
    );

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-[700px] px-1 md:px-4 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center uppercase font-bold">
                        Targets
                    </DialogTitle>

                    <div>
                        <h1 className="uppercase font-semibold text-start">
                            Market
                        </h1>
                        <Table className="w-fit md:w-full">
                            <TableBody>
                                <TableRow>
                                    <TableCell>NAME</TableCell>
                                    <TableCell className="uppercase">
                                        {marketTarget?.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>TARGET</TableCell>
                                    <TableCell>
                                        {marketTarget?.target}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>SOLD</TableCell>
                                    <TableCell>{marketTarget?.qty}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="max-h-96 h-96 max-w-[95vw] w-fit md:w-full">
                        <div className="flex items-center gap-10 my-3">
                            <h1 className="uppercase font-semibold text-start">
                                Clients
                            </h1>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() =>
                                    downloadToPDF(
                                        false,
                                        "#pptable",
                                        `${marketTarget?.name}_tarket.pdf`
                                    )
                                }
                            >
                                <Download className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="max-h-96 h-96 overflow-auto">
                            <Table id="pptable">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>S.NO</TableHead>
                                        <TableHead>NAME</TableHead>
                                        <TableHead>QTY</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedClients?.map((client, idx) => (
                                        <TableRow key={client?.clientId}>
                                            <TableCell className="text-start">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell className="text-start">
                                                {capitalizeWords(
                                                    client?.clientName
                                                )}
                                            </TableCell>
                                            <TableCell className="text-start">
                                                {client?.qty}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
