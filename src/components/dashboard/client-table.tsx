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
import { useModal } from "@/hooks/use-modal-store";

export const Clients = ({ clients }: { clients: clientType[] }) => {
    const { onOpen } = useModal();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px] uppercase">name</TableHead>
                    <TableHead className="uppercase">Sales</TableHead>
                    <TableHead className="uppercase">Amount</TableHead>
                    <TableHead className="uppercase">Payment</TableHead>
                    <TableHead className="uppercase">Dues</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clients?.map((client) => (
                    <TableRow
                        key={client?._id}
                        onClick={() =>
                            onOpen("userSaleDetails", {
                                clientSalesDetail: client,
                            })
                        }
                        className="cursor-pointer"
                    >
                        <TableCell className="font-medium capitalize">
                            {client?.name}
                        </TableCell>
                        <TableCell className="capitalize">
                            {client?.totalSale}
                        </TableCell>
                        <TableCell className="capitalize">
                            {client?.totalAmount}
                        </TableCell>
                        <TableCell>{client?.totalPayment}</TableCell>
                        <TableCell>{client?.totalDues}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
