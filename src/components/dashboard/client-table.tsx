"use client";
import { clientType } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const Clients = ({ clients }: { clients: clientType[] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px] uppercase">name</TableHead>
                    <TableHead className="w-[150px] uppercase">
                        Market
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
                            {client?.market ? client.market : "NA"}
                        </TableCell>
                        <TableCell className="capitalize">
                            {client?.sales}
                        </TableCell>
                        <TableCell className="capitalize">
                            {client?.totalAmount}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
