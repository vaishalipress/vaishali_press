"use client";
import { EachClientTypeInMarket } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IndianRupee } from "lucide-react";

export const Clients = ({ clients }: { clients: EachClientTypeInMarket[] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[100px] uppercase">
                        name
                    </TableHead>
                    <TableHead className="uppercase">Sales</TableHead>
                    <TableHead className="uppercase">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clients?.map((client) => (
                    <TableRow key={client?._id}>
                        <TableCell className="font-medium capitalize">
                            {client?.name}
                        </TableCell>
                        <TableCell className="capitalize">
                            {client?.sales}
                        </TableCell>
                        <TableCell>
                            <div className="capitalize flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {client?.totalAmount}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
